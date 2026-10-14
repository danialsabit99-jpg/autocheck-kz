# AutoCheck KZ — статический сайт

Сайт написан на чистых HTML, CSS и JavaScript. Сборщик и backend не нужны.

## Локальный запуск

Откройте `index.html` в браузере или запустите любой статический HTTP-сервер из папки `dist`.

## Публикация через GitHub Pages

1. Создайте репозиторий и загрузите содержимое папки `dist` в ветку `main`.
2. В GitHub откройте **Settings → Pages**.
3. В поле **Source** выберите **Deploy from a branch**, ветку `main` и папку `/ (root)`.
4. Нажмите **Save**. Через несколько минут GitHub Pages выдаст адрес сайта.

Сайт не отправляет данные в сеть. Demo-диагностика использует локальный учебный ruleset и прямо помечена как mock data.

## Источники

- Национальное бюро статистики РК: https://stat.gov.kz/news/tamyz-ayynda-166-6-my-avtok-lik-esepke-oyyldy/
- Kolesa.kz: https://kolesa.kz/content/news/na-kolesa-kz-v-obyavleniyah-o-prodazhe-poyavilas-istoriya-avto/
- Carly: https://www.mycarly.com/how-it-works/smart-mechanic/
- OBDeleven: https://obdeleven.com/features
- React: https://react.dev/learn
- FastAPI: https://fastapi.tiangolo.com/features/
- PostgreSQL: https://www.postgresql.org/docs/current/tutorial-fk.html
- Render: https://render.com/docs/deploy-fastapi

Hero-визуал создан специально для концепции AutoCheck KZ с помощью OpenAI ImageGen. Он не изображает реальный автомобильный сервис.
