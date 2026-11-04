/* Supabase 접속 설정.
   publishable 키는 브라우저 공개용으로 설계된 값이며, 실제 데이터 보호는
   DB의 RLS 정책(todos 테이블: 본인 행만 접근)이 담당한다.
   service_role / secret 키는 절대 여기에 넣지 말 것. */
window.SUPABASE_CONFIG = {
  url: 'https://dqqfcwilsghncshcblxg.supabase.co',
  key: 'sb_publishable_6jAVouJE5RhnbvImdBMmOw_9uiTI2Cs'
};
