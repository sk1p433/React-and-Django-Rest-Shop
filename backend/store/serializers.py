from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Comment, Product

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        #exclude = ('is_active', 'likes')
        fields = ('author', 'content', 'created_at')


class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ('likes',)
        #fields = '__all__'


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'



