from django.urls import path
from rest_framework.routers import SimpleRouter
from . import views



app_name = 'store'

router = SimpleRouter()
router.register('users', views.UserViewSet, basename = 'users')



urlpatterns = [
    path('categories/', views.CategoryListView.as_view(), name='category_list'),
    path('categories/<slug>/', views.CategoryDetailView.as_view(), name='category_detail'),
    path('categories/product/<slug>/', views.ProductDetailView.as_view(), name='product_detail'),
    path('categories/product/<str:pk>/add_rating/', views.api_add_rating, name='api_add_rating'),
    path('categories/product/<str:pk>/like/', views.api_addlike, name='api_add_like'),
    path('categories/product/<str:pk>/dislike/', views.api_add_dislike, name='api_add_dislike'),
    path('categories/product/<str:pk>/add_comment/', views.api_add_comment, name='api_add_comment'),
    path('api_profile/', views.api_profile, name='api_profile'),
    path('api_profile_orders/', views.api_profile_orders, name='api_profile_orders'),
    path('api_profile_update/', views.api_profile_update, name='api_profile_update'),
    path('cart/checkout/', views.api_order_create, name='api_order_create'),
    path('cart/api_get_token/', views.api_get_token, name='api_get_token'),
    path('cart/api_payment_process/', views.api_payment_process, name='api_payment_process'),
    path('login/', views.issue_token, name='issue_token'),
]

urlpatterns += router.urls
