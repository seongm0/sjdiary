export interface Todo {
  id: string;
  // 내용
  contents: string;
  // 완료 여부
  isCompleted: boolean;
  // 시간 범위
  dataRange: [start: Date, end: Date];
}

export interface Review {
  id: string;
  // 내용
  contents: string;
  // 시간 범위
  dataRange: [start: Date, end: Date];
}

export interface UnscheduledTodo {
  id: string;
  // 내용
  contents: string;
}

export interface UnscheduledReview {
  id: string;
  // 리뷰 내용
  contents: string;
}
