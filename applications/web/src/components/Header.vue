<script setup lang="ts"></script>

<template>
  <header>
    <span class="weekNavigator">
      <svg
        class="prev"
        xmlns="http://www.w3.org/2000/svg"
        width="30"
        height="31"
        viewBox="0 0 30 31"
        fill="none"
      >
        <path
          d="M19.2625 21.2375L13.5375 15.5L19.2625 9.7625L17.5 8L10 15.5L17.5 23L19.2625 21.2375Z"
          fill="#BBBBBB"
        />
      </svg>
      <p>12월 5째주</p>
      <svg
        class="next"
        xmlns="http://www.w3.org/2000/svg"
        width="30"
        height="31"
        viewBox="0 0 30 31"
        fill="none"
      >
        <path
          d="M10.7375 21.2375L16.4625 15.5L10.7375 9.7625L12.5 8L20 15.5L12.5 23L10.7375 21.2375Z"
          fill="#BBBBBB"
        />
      </svg>
      <button class="today">오늘</button>
    </span>
    <span class="indicatorWithProfile">
      <span class="indicator">실천율 30%</span>
      <img alt="프로필 이미지" />
    </span>
  </header>
</template>

<style scoped lang="scss">
header {
  width: 100%;
  height: 80px;
  background-color: #171717;
  padding: 20px;
}

.weekNavigator {
  display: inline-flex;
  align-items: flex-end;
  gap: 16px;

  p {
    color: var(--white1, #fff);
    font-variant-numeric: lining-nums tabular-nums;
    font-size: 30px;
    font-style: normal;
    font-weight: 600;
    line-height: 30px; /* 100% */
    letter-spacing: -0.5px;
  }

  .prev,
  .next {
    cursor: pointer;
    width: 30px;
    height: 30px;
  }

  .today {
    cursor: pointer;
    width: 48px;
    height: 31px;
    color: #bbb;
    text-align: center;
    font-variant-numeric: lining-nums tabular-nums;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    background-color: rgba(0, 0, 0, 1);
  }
}

.indicatorWithProfile {
  float: right;
  width: 144px;
  height: 40px;

  .indicator {
    color: var(--green1, #58cab5);
    text-align: right;
    font-variant-numeric: lining-nums tabular-nums;
    font-family: Pretendard;
    font-size: 18px;
    font-style: normal;
    font-weight: 600;
    line-height: 18px; /* 100% */
    letter-spacing: -0.5px;
  }

  img {
    width: 40px;
    height: 40px;
    border-radius: 100px;
  }
}
</style>
