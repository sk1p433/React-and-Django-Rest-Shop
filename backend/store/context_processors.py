from .models import Category


def main_menu(request):
    menu_items = ["Каталог", "Адреса магазинов", "О нас", "Корзина", "Личный кабинет", "Наш телефон 8-888-88-88-888"]
    return {'menu_items': menu_items,
    'categories': Category.objects.all(),
    }
