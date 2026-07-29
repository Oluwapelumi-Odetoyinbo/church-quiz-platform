import type { SubmitQuizResponse } from './quiz.model';

export interface AntiCheatRequest {
  attemptId: string;
}

export interface AntiCheatWarnResponse {
  action: 'warn';
  message: string;
  tabSwitchCount: number;
}

export interface AntiCheatAutoSubmitResponse {
  action: 'auto_submit';
  tabSwitchCount?: number;
  result: SubmitQuizResponse;
}

export type AntiCheatResponse = AntiCheatWarnResponse | AntiCheatAutoSubmitResponse;
