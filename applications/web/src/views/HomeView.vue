<script setup lang="ts">
import Header from '@/components/Header.vue';
import { computed, type Ref, ref } from 'vue';
import type { Review, Todo, UnscheduledReview, UnscheduledTodo } from '@/views/homeView.type.ts';

const draggingTodo = ref<Todo | UnscheduledTodo | null>(null);
const currentDragOverRow = ref<number | null>(null);
const today = ref(new Date());
const unscheduledTodos = ref<UnscheduledTodo[]>([]);
const scheduledTodos = ref<Todo[]>([
  {
    id: crypto.randomUUID(),
    contents: 'test1',
    dataRange: [
      (() => {
        const date = new Date();

        date.setHours(0, 0, 0, 0);

        return date;
      })(),
      (() => {
        const date = new Date();

        date.setHours(1, 30, 0, 0);

        return date;
      })(),
    ],
    isCompleted: false,
  },
  {
    id: crypto.randomUUID(),
    contents: 'test2',
    dataRange: [
      (() => {
        const date = new Date();

        date.setHours(4, 0, 0, 0);

        return date;
      })(),
      (() => {
        const date = new Date();

        date.setHours(6, 30, 0, 0);

        return date;
      })(),
    ],
    isCompleted: false,
  },
  {
    id: crypto.randomUUID(),
    contents: 'test3',
    dataRange: [
      (() => {
        const date = new Date();

        date.setHours(13, 0, 0, 0);

        return date;
      })(),
      (() => {
        const date = new Date();

        date.setHours(14, 30, 0, 0);

        return date;
      })(),
    ],
    isCompleted: false,
  },
]);
const unscheduledReviews = ref<UnscheduledReview[]>([]);
const scheduledReviews = ref<Review[]>([]);

const unscheduledTodoContents = ref<string | null>(null);
const unscheduledReviewContents = ref<string | null>(null);

const days = computed(() => {
  // 한주의 시작은 일요일로 설정
  const startOfWeek = new Date(today.value);
  startOfWeek.setDate(today.value.getDate() - today.value.getDay());

  return Array.from({ length: 7 }, (_, i) => {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + i);
    return day;
  });
});

const dayToString = (day: number): string => {
  return ['일', '월', '화', '수', '목', '금', '토'][day];
};

const times: number[] = Array.from({ length: 24 }, (_, i) => {
  return i;
});

const createUnscheduledTodo = (e: KeyboardEvent) => {
  if (e.key === 'Enter') {
    if (unscheduledTodoContents.value) {
      unscheduledTodos.value.push({
        id: crypto.randomUUID(),
        contents: unscheduledTodoContents.value,
      });

      unscheduledTodoContents.value = '';
    }

    (e.target as HTMLInputElement).blur(); // 입력 후 포커스를 해제하여 입력 필드를 비활성화
  }
};

const createUnscheduledReview = (e: KeyboardEvent) => {
  if (e.key === 'Enter') {
    if (unscheduledReviewContents.value) {
      unscheduledReviews.value.push({
        id: crypto.randomUUID(),
        contents: unscheduledReviewContents.value,
      });

      unscheduledReviewContents.value = null;
    }
  }
};

const moveToDate = (type: 'prevWeek' | 'nextWeek' | 'today') => {
  const currentDate = new Date(today.value);

  if (type === 'prevWeek') {
    currentDate.setDate(currentDate.getDate() - 7);
  } else if (type === 'nextWeek') {
    currentDate.setDate(currentDate.getDate() + 7);
  } else if (type === 'today') {
    currentDate.setFullYear(new Date().getFullYear());
    currentDate.setMonth(new Date().getMonth());
    currentDate.setDate(new Date().getDate());
  }

  today.value = currentDate;
};

const selectToday = (date: Date) => {
  today.value = date;
};

const calculateGridRow = (date: Date): number => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return hours * 2 + (minutes >= 30 ? 1 : 0) + 1; // 그리드의 row는 1부터 시작하므로 +1
};

const onDragEnd = (e: DragEvent) => {
  if (!draggingTodo.value) {
    return;
  }

  const { clientX, clientY } = e;

  // 드롭된 위치의 DOM 엘리먼트 얻기
  const element = document.elementFromPoint(clientX, clientY);
  const isDummy = element?.classList.contains('dummy') ?? false;
  console.log('Dropped element:', element);
  if (!element) {
    console.warn('No element found at drop position');
    return;
  } else if (!isDummy) {
    // 엘리먼트가 Grid 의 dummy 요소인지 확인
    console.warn('Dropped element is not a dummy element');
    return;
  }

  // 드롭된 위치의 그리드 row 계산
  const gridRowStart = getComputedStyle(element).gridRowStart;
  const row = Number(gridRowStart);
  console.log('Grid row start:', gridRowStart, 'Parsed row:', row);

  if (Number.isNaN(row)) {
    return;
  }

  // row는 1부터 시작, 30분 단위 → 시간 계산
  const startHour = Math.floor((row - 1) / 2);
  const startMinute = (row - 1) % 2 === 0 ? 0 : 30;

  const start = new Date(today.value);
  start.setHours(startHour, startMinute, 0, 0);

  const end = new Date(start);
  end.setMinutes(start.getMinutes() + 30); // 기본 30분 할당

  if (isTodo(draggingTodo)) {
    // 기존 Todo의 시간 범위가 있다면, 새로 계산한 시간으로 업데이트
    const [existingStart, existingEnd] = draggingTodo.value.dataRange;
    const timeDifference = existingEnd.getTime() - existingStart.getTime();

    console.log('Time difference:', timeDifference);
    end.setTime(start.getTime() + timeDifference); // 기존 시간 범위 유지

    if (start.getDate() !== end.getDate()) {
      end.setTime(start.getTime());
      end.setHours(23, 30, 0, 0); // 하루의 끝으로 설정
    }

    draggingTodo.value.dataRange = [start, end];

    scheduledTodos.value = scheduledTodos.value.map((todo) => {
      if (todo.id === draggingTodo.value.id) {
        return {
          ...todo,
          dataRange: [start, end],
        };
      }

      return todo;
    });
  } else {
    if (start.getDate() !== end.getDate()) {
      end.setTime(start.getTime());
      end.setHours(23, 30, 0, 0); // 하루의 끝으로 설정
    }

    scheduledTodos.value.push({
      id: draggingTodo.value.id,
      contents: draggingTodo.value.contents,
      dataRange: [start, end],
      isCompleted: false,
    });

    unscheduledTodos.value = unscheduledTodos.value.filter((t) => t.id !== draggingTodo.value?.id);
  }

  draggingTodo.value = null;
};

const isTodo = (todo: unknown): todo is Ref<Todo> => {
  return (todo as Ref<Todo>).value.dataRange !== undefined;
};

const isResizing = ref(false);
const resizeTarget = ref<Todo | null>(null);

const onResize = (e: MouseEvent, todo: Todo, type: 'up' | 'down') => {
  e.preventDefault();
  isResizing.value = true;
  resizeTarget.value = todo;
  const resizingHandler = type === 'up' ? onResizingUp : onResizingDown;
  window.addEventListener('mousemove', resizingHandler);
  window.addEventListener('mouseup', onResizeEnd(type));
};

const onResizeEnd = (type: 'up' | 'down') => () => {
  isResizing.value = false;
  resizeTarget.value = null;
  const resizingHandler = type === 'up' ? onResizingUp : onResizingDown;
  window.removeEventListener('mousemove', resizingHandler);
  window.removeEventListener('mouseup', onResizeEnd(type));
};

const onResizingDown = (e: MouseEvent) => {
  if (!resizeTarget.value) {
    return;
  }

  const container = document.querySelector('.contentContainer') as HTMLElement;
  if (!container) {
    return;
  }

  const rect = container.getBoundingClientRect();
  const scrollTop = container.scrollTop;

  // offsetY를 내부 스크롤 기준으로 재계산
  const offsetY = e.clientY - rect.top + scrollTop;

  const minutesPerRow = 30;
  const totalHeight = container.scrollHeight;
  const rowIndex = Math.floor(offsetY / (totalHeight / 48));
  const minute = rowIndex * minutesPerRow;

  const start = resizeTarget.value.dataRange[0];
  const newEnd = new Date(today.value);
  newEnd.setHours(Math.floor(minute / 60), minute % 60, 0, 0);

  if (newEnd.getTime() - start.getTime() >= 30 * 60 * 1000) {
    resizeTarget.value.dataRange[1] = newEnd;
  }
};

const onResizingUp = (e: MouseEvent) => {
  if (!resizeTarget.value) return;

  const container = document.querySelector('.contentContainer') as HTMLElement;
  if (!container) return;

  const rect = container.getBoundingClientRect();
  const scrollTop = container.scrollTop;

  // ① offsetY를 내부 스크롤 기준으로 재계산
  const offsetY = e.clientY - rect.top + scrollTop;

  const minutesPerRow = 30;
  const totalHeight = container.scrollHeight;
  const rowIndex = Math.floor(offsetY / (totalHeight / 48));
  const minute = rowIndex * minutesPerRow;

  const end = resizeTarget.value.dataRange[1];
  const newStart = new Date(today.value);
  newStart.setHours(Math.floor(minute / 60), minute % 60, 0, 0);

  if (end.getTime() - newStart.getTime() >= 30 * 60 * 1000) {
    resizeTarget.value.dataRange[0] = newStart;
  }
};
</script>

<template>
  <div class="container">
    <Header
      :today="today"
      @prev-week="moveToDate('prevWeek')"
      @next-week="moveToDate('nextWeek')"
      @today="moveToDate('today')"
    />
    <main>
      <section class="dayOfWeek">
        <div
          v-for="day in days"
          :key="day.toISOString()"
          :class="{
            today: today.getTime() === day.getTime(),
          }"
          class="day"
          @click="selectToday(day)"
        >
          <div>{{ dayToString(day.getDay()) }}</div>
          <div>{{ day.getDate() }}</div>
        </div>
      </section>
      <section class="unscheduledContainer">
        <div class="unscheduledTodoContainer">
          <div class="unscheduledTodoTitle">
            <p>오늘은 이렇게 보내고 싶어요</p>
          </div>
          <div class="unscheduledTodoInput">
            <input
              v-model="unscheduledTodoContents"
              placeholder="예정된 할일을 입력해주세요"
              @keydown="(e) => createUnscheduledTodo(e)"
            />
            <p>Drag&Drop으로 시간 선택 가능</p>
          </div>
          <div class="unscheduledTodoList">
            <div
              v-for="(todo, idx) in unscheduledTodos"
              :key="idx"
              draggable="true"
              class="task"
              @dragstart="draggingTodo = todo"
              @dragend="
                (e) => {
                  console.log(`drag ended for todo: ${todo.contents}`);
                  onDragEnd(e);
                }
              "
            >
              <input v-model="todo.contents" />
              <p>Drag&Drop으로 시간 선택 가능</p>
            </div>
          </div>
        </div>
        <div class="unscheduledReviewContainer">
          <div class="unscheduledReviewTitle">
            <p>오늘은 이렇게 보냈어요</p>
          </div>
          <div class="unscheduledReviewInput">
            <input
              v-model="unscheduledReviewContents"
              placeholder="예정된 할일을 입력해주세요"
              @keydown="(e) => createUnscheduledReview(e)"
            />
            <p>Drag&Drop으로 시간 선택 가능</p>
          </div>
          <div class="unscheduledReviewList">
            <div
              v-for="(review, idx) in unscheduledReviews"
              :key="idx"
              draggable="true"
              class="task"
            >
              <input v-model="review.contents" />
              <p>Drag&Drop으로 시간 선택 가능</p>
            </div>
          </div>
        </div>
      </section>
      <section class="contentContainer">
        <div
          v-for="n in 48"
          :key="'dummy-' + n"
          class="dummy"
          :class="{
            dragOver: currentDragOverRow === n,
          }"
          :style="{
            gridColumn: 2,
            gridRow: n,
          }"
          @dragover="
            (e) => {
              e.preventDefault();
              console.log('drag over for dummy:', n);
              currentDragOverRow = n;
            }
          "
          @dragleave="
            () => {
              currentDragOverRow = null;
            }
          "
          @drop="
            () => {
              currentDragOverRow = null;
            }
          "
        />

        <div
          v-for="n in 48"
          :key="'dummy-' + n"
          class="dummy"
          :style="{
            gridColumn: 3,
            gridRow: n,
          }"
        />

        <!--   시간     -->
        <div
          v-for="(time, idx) in times"
          :key="time"
          class="time"
          :style="{
            gridColumn: 1,
            gridRowStart: idx + 1 + idx,
            gridRowEnd: (idx + 1) * 2,
          }"
        >
          {{ time }}시
        </div>

        <!-- 중앙: Todo column -->
        <div
          v-for="(todo, idx) in scheduledTodos"
          :key="'todo-' + idx"
          class="task todo"
          :style="{
            gridColumn: 2,
            gridRowStart: calculateGridRow(todo.dataRange[0]),
            gridRowEnd: calculateGridRow(todo.dataRange[1]),
          }"
        >
          <div class="resize header" @mousedown.stop="(e) => onResize(e, todo, 'up')" />
          <div
            class="contents"
            draggable="true"
            @dragend.stop="(e) => onDragEnd(e)"
            @dragstart.stop="
              () => {
                draggingTodo = todo;
              }
            "
          >
            {{ todo.contents }}
          </div>
          <div class="resize bottom" @mousedown.stop="(e) => onResize(e, todo, 'down')" />
        </div>

        <!-- 우측: 회고 column -->
        <div
          v-for="(review, idx) in scheduledReviews"
          :key="'review-' + idx"
          class="task review"
          :style="{
            gridColumn: 3,
            gridRowStart: calculateGridRow(review.dataRange[0]),
            gridRowEnd: calculateGridRow(review.dataRange[1]),
          }"
        >
          {{ review.contents }}
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped lang="scss">
.container {
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  width: 850px;
  height: 100vh;
  background-color: #171717;

  main {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
}

.dayOfWeek {
  display: flex;
  height: 72px;
  flex-direction: row;
  padding: 0 16px 0 60px;
  gap: 8px;
  background: var(--black2, #171717);

  .day {
    display: flex;
    padding: 16px 20px;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    flex: 1 0 0;
    cursor: pointer;
  }

  .today {
    color: #9299ff;
  }
}

.unscheduledContainer {
  display: flex;
  padding: 0 0 0 60px;

  .unscheduledTodoContainer,
  .unscheduledReviewContainer {
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: center;

    .unscheduledTodoTitle,
    .unscheduledReviewTitle {
      display: flex;
      flex-direction: column;
      width: 100%;
      padding: 24px 16px;
      justify-content: center;
      align-items: center;
      font-size: 14px;
      border: 1px solid #333;
      gap: 10px;
    }

    .unscheduledTodoInput,
    .unscheduledReviewInput {
      display: flex;
      flex-direction: column;
      width: 100%;
      padding: 16px;
      justify-content: center;
      font-size: 14px;
      border: 1px solid #333;
      gap: 4px;

      p {
        color: var(--grey1, #bbb);
        font-variant-numeric: lining-nums tabular-nums;
        font-family: Pretendard;
        font-size: 12px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
        letter-spacing: -0.5px;
      }

      input {
        display: block;
        height: 100%;
        background-color: transparent;
        border: none;
        color: #fff;
        font-size: 14px;
        text-align: left;

        &::placeholder {
          color: #bbb;
        }
      }
    }

    .unscheduledTodoList,
    .unscheduledReviewList {
      display: flex;
      flex-direction: column;
      flex: 1;
      width: 100%;
      max-height: 200px; // 최대 높이 설정
      overflow-y: auto;

      .task {
        display: flex;
        flex-direction: column;
        width: 100%;
        padding: 16px;
        justify-content: center;
        font-size: 14px;
        border: 1px solid #333;
        gap: 4px;

        p {
          color: var(--grey1, #bbb);
          font-variant-numeric: lining-nums tabular-nums;
          font-family: Pretendard;
          font-size: 12px;
          font-style: normal;
          font-weight: 400;
          line-height: normal;
          letter-spacing: -0.5px;
        }

        input {
          display: block;
          height: 100%;
          background-color: transparent;
          border: none;
          color: #fff;
          font-size: 14px;
          text-align: left;

          &::placeholder {
            color: #bbb;
          }
        }
      }
    }
  }
}

.contentContainer {
  flex: 1;
  overflow-y: auto;
  display: grid;
  align-items: stretch;
  grid-template-columns: 60px repeat(2, 1fr);
  grid-template-rows: repeat(48, 30px); // 30분 단위
  box-sizing: border-box;

  .time {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
  }

  .dummy {
    background-color: transparent;

    &.dragOver {
      background-color: rgba(255, 255, 255, 0.1);
      z-index: 100;
    }
  }

  .task {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    border: 1px solid #333;
  }

  .todo {
    position: relative;
    background: #0b0b2a; // 네이비톤

    .contents {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 8px;
      cursor: move;
    }

    .resize {
      position: absolute;
      left: 0;
      height: 8px;
      width: 100%;
      cursor: ns-resize;
      background-color: rgba(255, 255, 255, 0.1);

      &.header {
        top: 0;
      }

      &.bottom {
        bottom: 0;
      }
    }
  }

  .review {
    background: #0a2f2f; // 그린톤
    //background-color: #171717;
  }
}
</style>
