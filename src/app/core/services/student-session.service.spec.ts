import { TestBed } from '@angular/core/testing';

import { StudentSessionService } from './student-session.service';

describe('StudentSessionService', () => {
  let service: StudentSessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StudentSessionService);
    service.clear();
  });

  it('tracks completed subjects and resets after the full cycle', () => {
    const allSubjects = ['general-knowledge', 'science', 'history', 'mathematics'];

    service.completeSubject('general-knowledge', allSubjects);

    expect(service.isSubjectCompleted('general-knowledge')).toBeTrue();
    expect(service.isAllSubjectsCompleted(allSubjects)).toBeFalse();

    allSubjects.forEach((subjectId) => service.completeSubject(subjectId, allSubjects));

    expect(service.getCompletedSubjects()).toEqual([]);
    expect(service.isAllSubjectsCompleted(allSubjects)).toBeFalse();
    expect(service.isSubjectCompleted('science')).toBeFalse();
  });
});
