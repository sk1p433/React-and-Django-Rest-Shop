# React-and-Django-Rest-Shop-E-commerce
Изначально проект написан на Django, далее в /backend/store/api вынесен в API с помощью Django Rest Framework и фронтенд переработан на React.
В версии на React дописан рейтинг товара(звёзды).

В магазине реализованы: каталог, корзина, формирование заказа(сохранение order на бэкенде), оплата товара по карте через Braintree Drop-in, авторизация и регистрация
по токенам, личный кабинет со статистикой покупок и данными для доставки, пагинатор для комментариев.
К товарам доступна система оценки: рейтинг товара(звёзды) и комментирование, к комментариям можно ставить лайки или дизлайки.
