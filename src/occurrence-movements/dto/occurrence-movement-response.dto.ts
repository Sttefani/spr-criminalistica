/* eslint-disable @typescript-eslint/no-explicit-any */
export class OccurrenceMovementResponseDto {
  id: string;
  occurrenceId: string;
  description: string;
  deadline: Date | null;
  originalDeadline: Date | null;
  isOverdue: boolean;
  isNearDeadline: boolean;
  wasExtended: boolean;
  extensionJustification: string | null;
  performedBy: {
    id: string;
    name: string;
    role: string;
  };
  performedAt: Date;
  isSystemGenerated: boolean;
  additionalData: any;
}

export class OccurrenceWithMovementsDto {
  id: string;
  caseNumber: string;
  deadline: Date | null;
  isOverdue: boolean;
  isNearDeadline: boolean;
  status: string;
  movements: OccurrenceMovementResponseDto[];
}