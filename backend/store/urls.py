from django.urls import path
from django.contrib.auth.views import LogoutView

from .views import *

app_name = 'store'
urlpatterns = [
	path('', index, name='index'),
	path('categories/', ShowCategories.as_view(), name='categories'),
	path('categories/<slug:category_slug>/', ShowCategory.as_view(), name='category'),
	path('products/<slug:product_slug>/', ShowProduct.as_view(), name='product'),
	path('shops/', show_shops, name='shops'),
	path('about/', about_us, name='about'),
	path('register/', RegisterUser.as_view(), name='register'),
	path('login/', LoginUser.as_view(), name="login"),
	path('logout/', LogoutView.as_view(), name="logout"),
	path('ajax_receiver/', ajax_receiver, name='ajax_receiver'),
	path('products/<int:pk>/like/', addlike, name='add_like'),
	path('products/<int:pk>/dislike/', AddDislike.as_view(), name='add_dislike'),
]
