export const CERTIFICATE_EMAIL_TEMPLATE = (certificateNumber: string) => `
<!DOCTYPE html>
<html lang="ru" xmlns="http://www.w3.org/1999/xhtml">

<head>
  <meta content="text/html; charset=utf-8" http-equiv="Content-Type">
  <meta content="IE=edge" http-equiv="X-UA-Compatible">
  <meta content="width=device-width, initial-scale=1.0" name="viewport">
  <title>Ваше морское приключение начинается здесь</title>
  <link
    href="https://fonts.googleapis.com/css2?family=Lobster&amp;family=Inter:wght@300;400;600&amp;display=swap"
    rel="stylesheet">
  <style type="text/css">
    .btn:hover {
      background-color: #112543 !important;
    }

    .nav-link {
      transition: color 0.2s ease, opacity 0.2s ease;
    }

    .nav-link:hover {
      color: #3a6db5 !important;
      opacity: 0.85;
    }

    .social-link {
      transition: color 0.2s ease, opacity 0.2s ease;
    }

    .social-link:hover {
      color: #3a6db5 !important;
      opacity: 0.85;
    }

    @media screen and (max-width: 600px) {
      .main {
        width: 100% !important;
      }

      .content-padding {
        padding: 30px 20px !important;
      }
    }
  </style>
</head>

<body style="margin: 0; padding: 0; background-color: #f5f3ee; font-family: 'Inter', Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  <center class="wrapper" style="width: 100%; table-layout: fixed; background-color: #f9fafb; padding-top: 40px; padding-bottom: 40px;">
    <table align="center" class="main" style="background-color: #ffffff; margin: 0 auto; max-width: 600px; width: 100%; border-spacing: 0; border-collapse: collapse; border-radius: 8px; overflow: hidden; color: #1b1c19;">
      <tbody>
        <tr>
          <td class="header-card" style="padding: 0; background-color: #1B365D; border-radius: 8px 8px 0 0; position: relative;">
            <table width="100%" style="border-spacing: 0; border-collapse: collapse;">
              <tbody>
                <tr>
                  <td style="padding: 0;">
                    <img alt="Gosailingfun.com"
                      src="https://gosailingfun.vercel.app/public/go-sailing-fun-logo.jpg"
                      style="width: 100%; height: auto; display: block; border: 0;" width="600">
                  </td>
                </tr>
                <tr>
                  <td style="padding: 30px 30px; background-color: #1B365D;">
                    <h1 class="font-lobster"
                      style="color: #ffffff; font-family: 'Lobster', cursive; font-size: 36px; line-height: 46px; margin: 0px; text-align: center; font-weight: normal;">
                      Ваше морское приключение начинается здесь
                    </h1>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
        <tr>
          <td class="content-padding" style="padding: 40px 40px;">
            <table width="100%" style="border-spacing: 0; border-collapse: collapse;">
              <tbody>
                <tr>
                  <td style="padding: 0;">
                    <div style="font-size: 28px; line-height: 26px; color: #1B365D; margin: 0px 0px 20px; text-align: center; font-weight: 600;">
                      Сертификат: № ${certificateNumber}
                    </div>
                    <p
                      style="font-size: 16px; line-height: 26px; color: #44474E; margin: 0px 0px 32px; text-align: center; font-family: 'Inter', Arial, sans-serif;">
                      Подарок для прогулки на яхте готов. <br />
                      Мы приложили ваш персональный подарочный сертификат в формате PDF к этому письму.<br />
                      С нетерпением ждем встречи с вами на борту!
                    </p>
                    <table align="center" border="0" cellpadding="0" cellspacing="0" style="border-spacing: 0; border-collapse: collapse;">
                      <tbody>
                        <tr>
                          <td align="center" class="bg-navy" style="padding: 0; background-color: #1B365D; border-radius: 20px;">
                            <a class="btn" href="https://go-sailing.ru/" target="_blank" style="color: #ffffff; text-decoration: none; display: inline-block; padding: 24px 36px; font-weight: 600; letter-spacing: 1px; font-size: 14px; border-radius: 20px; transition: ease-in background-color 0.15s; font-family: 'Inter', Arial, sans-serif;">ЗАБРОНИРОВАТЬ ПРОГУЛКУ</a>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
        <tr>
          <td class="footer" style="padding: 40px 30px; background-color: #f4f5f8; color: #1B365D; font-size: 14px; text-align: center;">
            <table width="100%" style="border-spacing: 0; border-collapse: collapse;">
              <tbody>
                <tr>
                  <td style="padding: 0 0 20px; text-align: center;">
                    <a class="nav-link" href="https://gosailingfun.com/" style="color: #1B365D; text-decoration: none; margin: 0 10px; font-weight: 600; font-family: 'Inter', Arial, sans-serif;">Туры</a>
                    <a class="nav-link" href="https://gosailingfun.com/" style="color: #1B365D; text-decoration: none; margin: 0 10px; font-weight: 600; font-family: 'Inter', Arial, sans-serif;">Регаты</a>
                    <a class="nav-link" href="https://gosailingfun.com/" style="color: #1B365D; text-decoration: none; margin: 0 10px; font-weight: 600; font-family: 'Inter', Arial, sans-serif;">Обучение</a>
                    <a class="nav-link" href="https://gosailingfun.com/" style="color: #1B365D; text-decoration: none; margin: 0 10px; font-weight: 600; font-family: 'Inter', Arial, sans-serif;">Корпоративный Яхтинг</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 0; text-align: center;">
                    <a class="social-link" href="https://vk.com/public211738230" style="color: #1B365D; text-decoration: none; margin: 0 8px; font-family: 'Inter', Arial, sans-serif;">VK</a>
                    <a class="social-link" href="https://t.me/RomanSKIPPER" style="color: #1B365D; text-decoration: none; margin: 0 8px; font-family: 'Inter', Arial, sans-serif;">Telegram</a>
                    <a class="social-link" href="https://wa.me/79217824446" style="color: #1B365D; text-decoration: none; margin: 0 8px; font-family: 'Inter', Arial, sans-serif;">WhatsApp</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 20px 0px; text-align: center;">
                    <p style="margin: 0px;">
                      <a href="https://go-sailing.ru/#rec707606391" target="_blank" style="color: #1B365D; text-decoration: underline; font-family: 'Inter', Arial, sans-serif;">
                        Связаться с нами
                      </a>
                    </p>
                    <p style="margin: 15px 0px 0px; font-family: 'Inter', Arial, sans-serif;">© 2026 GoSailingFun. Все права защищены.</p>
                    <p style="margin: 25px 0px 0px; font-size: 24px; opacity: 0.8;">⛵ ⚓ 🌊</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  </center>
</body>
</html>
`;
