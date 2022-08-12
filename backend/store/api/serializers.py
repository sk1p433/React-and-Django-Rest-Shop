from django.contrib.auth import get_user_model
from rest_framework import serializers
from ..models import Category, Product, Comment, Rating
from orders.models import Order, OrderItem, Profile
from rest_framework.authtoken.models import Token
from django.db.models import Avg

#Serializers for product comments and rating
class CommentSerializer(serializers.ModelSerializer):

    class Meta:
        model = Comment
        fields = ['author', 'content', 'total_likes', 'total_dislikes', 'created_at','id','product']

        def total_likes(self):
            return self.likes.count()

        def total_dislikes(self):
            return self.dislikes.count()    


class RatingSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Rating
        fields = ['stars', 'product']

                   
#Serializers for Auth
class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = get_user_model()
        fields = ['id','username','email']

class IssueTokenRequestSerializer(serializers.Serializer):
    model = get_user_model()

    username = serializers.CharField(required=True)
    password = serializers.CharField(required=True)


class TokenSerializer(serializers.ModelSerializer):

    class Meta:
        model = Token
        fields = ['key']


#Serializers for Products
class ProductSerializer(serializers.ModelSerializer):
    comments = CommentSerializer(source='comment_set', many=True)
        
    class Meta:
        model = Product
        fields = ['name', 'slug', 'average_rating', 'category', 'description', 'price','image','id','comments']
        depth = 1

    def to_representation(self, instance):
        data = super().to_representation(instance)
        if not data['image']:
            data['image'] = "http://127.0.0.1:8000/media/photos/noimage.jpg"
        return data    

class CategoryListSerializer(serializers.ModelSerializer):

    class Meta:
        model = Category
        fields = ['name', 'describe', 'slug','products','id','image']

class OneProductSerializer(serializers.ModelSerializer):
        
    class Meta:
        model = Product
        fields = ['name','image','average_rating','id','slug']  

    def to_representation(self, instance):
        data = super().to_representation(instance)
        if not data['image']:
            data['image'] = "http://127.0.0.1:8000/media/photos/noimage.jpg"
        return data        


class CategorySerializer(serializers.ModelSerializer):
    products = OneProductSerializer(many=True, read_only=True)

    class Meta:
        model = Category
        fields = ['name','slug','products','slug']
        lookup_field = 'slug'
                
        
#Serializers for Payments
class OrderSerializer(serializers.ModelSerializer):

    class Meta:
        model = Order
        fields = ['first_name', 'last_name', 'email', 'address','postal_code', 'city','id']


class OrderItemSerializer(serializers.Serializer):
    
    price = serializers.FloatField()
    quantity = serializers.IntegerField()
    id = serializers.IntegerField()
    
class OrderIDSerializer(serializers.Serializer):

    orderid = serializers.IntegerField()


#Serializers for Profile
class ProfileSerializer(serializers.ModelSerializer):

    class Meta:
        model = Profile
        fields = ['first_name', 'last_name', 'email', 'address','postal_code', 'city']



class OrderItemModelSerializer(serializers.ModelSerializer): 
    name = OneProductSerializer(source='product', many=False)

    class Meta:
        model = OrderItem
        fields = ['quantity', 'price','name']

class OrderItemProfileSerializer(serializers.ModelSerializer):
    products = OrderItemModelSerializer(source='items', many=True)

    class Meta:
        model = Order
        fields = ['id','created','paid','get_total_cost', 'products']    

    def get_total_cost(self, obj):
        return sum(item.get_cost() for item in self.items.all())             

    
    
    
    

    



    
