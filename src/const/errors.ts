export const ERROR_MESSAGES = {
  MISSING_FIELDS: 'Отсутствуют обязательные поля в запросе',
  INVALID_CERTIFICATE: 'Сертификат не найден или недействителен в YCLIENTS',
  YCLIENTS_RATE_LIMIT_EXCEEDED: 'YCLIENTS_RATE_LIMIT_EXCEEDED', // Оставляем константу на английском, так как она может использоваться для внутренней логики матчинга
  YCLIENTS_VALIDATION_TOO_MANY_REQUESTS: 'Слишком много запросов к сервису валидации YCLIENTS',
  CORS_NOT_ALLOWED: 'Политика CORS для этого сайта не разрешает доступ с указанного источника (Origin).',
  TOO_MANY_REQUESTS_CERT_GEN:
    'Слишком много запросов на генерацию сертификата, пожалуйста, повторите попытку через 1 минуту',
  SOMETHING_WENT_WRONG: 'Что-то пошло не так',
  INTERNAL_SERVER_ERROR: 'Внутренняя ошибка сервера',
};
