import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ALGORITHM_TASKS, AlgorithmTask } from './algorithm-data';

declare global {
  interface Window {
    Sk?: {
      configure: (options: { output: (text: string) => void; read?: (fileName: string) => string }) => void;
      importMainWithBody: (fileName: string, canSuspend: boolean, code: string, canSuspendOnCode: boolean) => Promise<unknown>;
    };
  }
}

@Component({
  selector: 'app-algorithm-workspace',
  standalone: true,
  imports: [CommonModule, FormsModule, NgOptimizedImage],
  templateUrl: './algorithm-workspace.html',
  styleUrl: './algorithm-workspace.scss',
})
export class AlgorithmWorkspace implements OnInit {
  tasks: AlgorithmTask[] = ALGORITHM_TASKS;
  activeTask: AlgorithmTask = this.tasks[0];
  pythonLoadError = signal('');
  copyStatus = signal('');
  indentationStatus = signal('');
  isPythonReady = signal(false);
  isRunning = signal(false);
  activeExerciseView: 'task' | 'solution' = 'task';
  private pythonInitialization?: Promise<void>;
  exercises: WorkspaceExercise[] = [];

  constructor(private route: ActivatedRoute) {}

  async ngOnInit(): Promise<void> {
    this.route.queryParamMap.subscribe((params) => {
      const selectedId = Number(params.get('id'));
      const matchedTask = this.tasks.find((task) => task.id === selectedId) ?? this.tasks[0];
      this.activeTask = matchedTask;
      this.activeExerciseView = 'task';
      this.exercises = this.createExercises(matchedTask);
      this.pythonLoadError.set('');
    });

    void this.initializePython().catch((error) => {
      this.pythonLoadError.set(error instanceof Error ? error.message : 'A Python környezet nem tölthető be.');
    });
  }

  private createExercises(task: AlgorithmTask): WorkspaceExercise[] {
    const initialCode = this.asMainProgram(this.stripTaskComments(task.starterCode));
    return [
      {
        stage: 'Önálló feladat',
        title: task.title,
        task: task.taskDescription,
        requirements: task.requirements,
        inputValues: task.inputValues,
        initialCode,
        starterCode: initialCode,
        helpCode: this.asMainProgram(task.starterCode),
        solutionCode: this.asMainProgram(task.solutionCode),
        expectedOutput: task.expectedOutput,
        output: signal(''),
      },
    ];
  }

  private stripTaskComments(code: string): string {
    const result: string[] = [];
    let skipping = false;
    for (const line of code.split(/\r?\n/)) {
      const isComment = /^\s*#/.test(line);
      if (
        /^\s*#\s*(Feladat|Segitseg):/.test(line) ||
        /^\s*#\s*(Állítsd meg a keresést|Vizsgáld meg a szomszédos mezőt)/.test(line)
      ) {
        skipping = true;
        continue;
      }
      if (skipping && isComment) {
        continue;
      }
      skipping = false;
      result.push(line);
    }
    return result.join('\n');
  }

  private asMainProgram(code: string): string {
    if (/^\s*if\s+__name__\s*==\s*["']__main__["']\s*:/m.test(code)) {
      return code.trimEnd();
    }

    const lines = code.trimEnd().split(/\r?\n/);
    const helperFunctions: string[][] = [];
    const mainLines: string[] = [];

    for (let index = 0; index < lines.length;) {
      if (/^def [A-Za-z_][A-Za-z0-9_]*\s*\(/.test(lines[index])) {
        const functionLines = [lines[index]];
        index += 1;

        while (index < lines.length && (lines[index].trim().length === 0 || /^\s/.test(lines[index]))) {
          functionLines.push(lines[index]);
          index += 1;
        }

        helperFunctions.push(functionLines);
        continue;
      }

      mainLines.push(lines[index]);
      index += 1;
    }

    const functions = helperFunctions.map((functionLines) => functionLines.join('\n').trimEnd());
    const mainBody = mainLines.map((line) => (line ? `    ${line}` : '')).join('\n').trimEnd();
    const program = `${functions.length ? `${functions.join('\n\n')}\n\n` : ''}if __name__ == '__main__':\n${mainBody}`;
    return program;
  }

  restoreCode(exercise: WorkspaceExercise): void {
    exercise.starterCode = exercise.initialCode;
    exercise.output.set('');
    this.indentationStatus.set('');
  }

  showHelp(exercise: WorkspaceExercise): void {
    exercise.starterCode = exercise.helpCode;
    exercise.output.set('');
  }

  loadSolution(exercise: WorkspaceExercise): void {
    exercise.starterCode = exercise.solutionCode;
    exercise.output.set('');
    this.activeExerciseView = 'task';
  }

  async copySolution(exercise: WorkspaceExercise): Promise<void> {
    try {
      await navigator.clipboard.writeText(exercise.solutionCode);
      this.copyStatus.set('A kód a vágólapra került.');
    } catch {
      this.copyStatus.set('A másolás nem sikerült. Jelöld ki és másold ki a kódot.');
    }
  }

  private normalizeEditorIndentation(exercise: WorkspaceExercise): boolean {
    if (exercise.starterCode.trim().length === 0) {
      this.indentationStatus.set('A kódszerkesztő üres.');
      return false;
    }

    if (this.isFlattenedCode(exercise.starterCode)) {
      this.indentationStatus.set('A sortörések hiányoznak, és a kód nem egyezik a feladat mintájával. Illeszd be újra a teljes kódot.');
      return false;
    }

    const result = this.removeCommonIndentation(exercise.starterCode);

    if (result.removedCharacters === 0) {
      this.indentationStatus.set('');
      return true;
    }

    exercise.starterCode = result.code;
    this.indentationStatus.set(`Eltávolítottam a sorok eleji ${result.removedCharacters} közös behúzási karaktert.`);
    return true;
  }

  handleCodePaste(event: ClipboardEvent, exercise: WorkspaceExercise): void {
    const pastedCode = event.clipboardData?.getData('text/plain');
    const textarea = event.target;

    if (!pastedCode || !(textarea instanceof HTMLTextAreaElement)) {
      return;
    }

    const restoredCode = this.restoreKnownCodeLayout(pastedCode, exercise);
    if (restoredCode !== null) {
      event.preventDefault();
      textarea.setRangeText(restoredCode, textarea.selectionStart, textarea.selectionEnd, 'end');
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
      this.indentationStatus.set('A sortöréseket és behúzásokat automatikusan visszaállítottam.');
      return;
    }

    if (this.isFlattenedCode(pastedCode)) {
      this.indentationStatus.set('A kód egy sorba lapult, de nem egyezik a feladat mintájával, ezért nem formáztam át találgatással.');
      return;
    }

    const result = this.removeCommonIndentation(pastedCode);
    if (result.removedCharacters === 0) {
      this.indentationStatus.set('');
      return;
    }

    event.preventDefault();
    textarea.setRangeText(result.code, textarea.selectionStart, textarea.selectionEnd, 'end');
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
    this.indentationStatus.set(`Beillesztéskor eltávolítottam ${result.removedCharacters} közös behúzási karaktert.`);
  }

  private restoreKnownCodeLayout(pastedCode: string, exercise: WorkspaceExercise): string | null {
    const source = pastedCode.replace(
      /\s*#\s*See PyCharm help at https?:\/\/www\.jetbrains\.com\/help\/pycharm\/?\s*$/i,
      '',
    );
    const pastedFingerprint = this.codeFingerprint(source);
    const knownCode = [exercise.starterCode, exercise.solutionCode];

    return knownCode.find((code) => this.codeFingerprint(code) === pastedFingerprint) ?? null;
  }

  private codeFingerprint(code: string): string {
    let normalizedCode = code;

    if (this.activeTask.id === 1) {
      normalizedCode = normalizedCode
        .replaceAll('"S...#.."', '"+...#.."')
        .replaceAll('"...##.E"', '"...##.O"')
        .replaceAll('== "S"', '== "+"')
        .replaceAll('== "E"', '== "O"');
    }

    return normalizedCode.replace(/\s+/g, '');
  }

  private isFlattenedCode(code: string): boolean {
    return !/[\r\n]/.test(code) && code.trim().length > 160;
  }

  private removeCommonIndentation(code: string): { code: string; removedCharacters: number } {
    const lines = code.split(/\r?\n/);
    const codeLines = lines.filter((line) => line.trim().length > 0);

    if (codeLines.length === 0) {
      return { code, removedCharacters: 0 };
    }

    const removedCharacters = Math.min(
      ...codeLines.map((line) => line.match(/^[\t ]*/)?.[0].length ?? 0),
    );

    if (removedCharacters === 0) {
      return { code, removedCharacters };
    }

    return {
      code: lines.map((line) => (line.trim().length > 0 ? line.slice(removedCharacters) : '')).join('\n'),
      removedCharacters,
    };
  }

  private async initializePython(): Promise<void> {
    if (this.isPythonReady() && window.Sk) {
      return;
    }

    if (this.pythonInitialization) {
      return this.pythonInitialization;
    }

    this.pythonInitialization = this.loadSkulptRuntime();

    try {
      await this.pythonInitialization;
    } catch (error) {
      this.pythonInitialization = undefined;
      throw error;
    }
  }

  private async loadSkulptRuntime(): Promise<void> {
    await this.loadScript('https://cdn.jsdelivr.net/npm/skulpt@1.2.0/dist/skulpt.min.js', 'skulpt-loader');
    await this.loadScript('https://cdn.jsdelivr.net/npm/skulpt@1.2.0/dist/skulpt-stdlib.js', 'skulpt-stdlib-loader');

    if (!window.Sk) {
      throw new Error('A Python kornyezet nem toltheto be.');
    }

    this.isPythonReady.set(true);
  }

  private loadScript(source: string, id: string): Promise<void> {
    const existingScript = document.getElementById(id) as HTMLScriptElement | null;
    if (existingScript) {
      return Promise.resolve();
    }

    const script = document.createElement('script');
    script.id = id;
    script.src = source;
    script.async = true;

    return new Promise<void>((resolve, reject) => {
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('A Python kornyezet nem toltheto be.'));
      document.body.appendChild(script);
    });
  }

  async runPython(exercise: WorkspaceExercise): Promise<void> {
    try {
      this.isRunning.set(true);
      if (!this.normalizeEditorIndentation(exercise)) {
        exercise.output.set(this.indentationStatus());
        return;
      }
      exercise.output.set('');
      await this.initializePython();

      let capturedOutput = '';
      window.Sk!.configure({
        output: (value: string) => {
          capturedOutput += value;
        },
      });
      await window.Sk!.importMainWithBody('<stdin>', false, exercise.starterCode, true);
      exercise.output.set(capturedOutput || 'A program lefutott, nincs kimenet.');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      exercise.output.set(errorMessage === '[object Object]' ? 'Ismeretlen Python-futási hiba.' : errorMessage);
    } finally {
      this.isRunning.set(false);
    }
  }
}

interface WorkspaceExercise {
  stage: string;
  title: string;
  task: string;
  requirements: string[];
  inputValues: string[];
  initialCode: string;
  helpCode: string;
  starterCode: string;
  solutionCode: string;
  expectedOutput: string;
  output: WritableSignal<string>;
}
