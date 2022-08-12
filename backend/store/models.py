from django.db import models
from django.contrib.auth.models import User
from django.urls import reverse
from django.core.validators import MaxValueValidator, MinValueValidator
# Create your models here.
from django.db.models import Avg
from django.db.models import CheckConstraint, Q, UniqueConstraint




# Create your models here.

class Category(models.Model):
    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=255, unique=True, db_index=True, verbose_name="URL")
    describe = models.TextField(blank=True)
    image = models.ImageField(upload_to="photos/%Y/%m/%d/", default='/photos/noimage.jpg', blank=True)

    def get_absolute_url(self):
        return reverse('store:category', kwargs={'category_slug': self.slug})



    def __str__(self):
        return self.name

    class Meta:
        ordering = ('name',)
        verbose_name = 'category'
        verbose_name_plural = 'categories'


class Product(models.Model):
    category = models.ForeignKey(Category, related_name='products', on_delete=models.CASCADE)
    name = models.CharField(max_length=200, db_index=True)
    slug = models.SlugField(max_length=200, db_index=True)
    image = models.ImageField(upload_to="photos/%Y/%m/%d/", default='/photos/noimage.jpg')
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    available = models.BooleanField(default=True)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ('name',)

    def __str__(self):
        return self.name

    def get_absolute_url(self):
        return reverse('store:product', kwargs={'product_slug': self.slug})

    def getImage(self, obj):
        if not self.image:
            # depending on your template
            return default_path or default_image_object

    def average_rating(self):
        return self.reviews.aggregate(Avg('stars'))        

            
class Rating(models.Model):
    stars = models.PositiveSmallIntegerField(default=0,validators=[MinValueValidator(1), MaxValueValidator(5)])
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name ='reviews')
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    class Meta:
        constraints = [
            CheckConstraint(check=Q(stars__range=(0, 5)), name='valid_stars'),
            UniqueConstraint(fields=['user', 'product'], name='rating_once')
        ]    
         

class MenuItem(models.Model):
    title = models.CharField(max_length=200, verbose_name='Заголовок')
    body = models.TextField(blank=True, verbose_name='Текст')

    def get_absolute_url(self):
        return reverse('store:menu_item_url', kwargs={'slug': self.slug})

    def __str__(self):
        return self.title


class Comment(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, verbose_name='Продукт')
    author = models.CharField(max_length=30, verbose_name= 'Автор')
    content = models.TextField(verbose_name='Содержание')
    likes = models.ManyToManyField(User, related_name='likes', blank=True)
    dislikes = models.ManyToManyField(User, related_name='dislikes', blank=True)
    is_active = models.BooleanField(default=True, db_index=True,verbose_name='Выводить на экран?')
    created_at = models.DateTimeField(auto_now_add=True, db_index=True, verbose_name='Опубликован')

    class Meta:
        verbose_name_plural = 'Комментарии'
        verbose_name = 'Комментарий'
        ordering = ['created_at']

    def __str__(self):
        return self.content

    def total_likes(self):
        return self.likes.count()

    def total_dislikes(self):
        return self.dislikes.count()


