from django.contrib import admin
from django.utils.html import format_html
from django.utils.html import mark_safe
from .models import Category, Product, Comment, Rating

# Register your models here.


class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug','describe']
    prepopulated_fields = {'slug': ('name',)}


class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'price','available', 'created', 'updated', 'description', 'id', 'average_rating']
    list_filter = ['available', 'created', 'updated']
    list_editable = ['price', 'available']
    prepopulated_fields = {'slug': ('name',)}

    
class RatingAdmin(admin.ModelAdmin):
    list_display = ['product', 'user','stars']
        

class CommentAdmin(admin.ModelAdmin):
    list_display = ['product','author','content','id','created_at','total_dislikes','total_likes']

# Register your models here.

admin.site.register(Category, CategoryAdmin)
admin.site.register(Product, ProductAdmin)
admin.site.register(Comment, CommentAdmin)
admin.site.register(Rating, RatingAdmin)




    