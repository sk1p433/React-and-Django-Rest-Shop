from rest_framework import generics, status, permissions, viewsets

from ..models import Category, Product, Comment, Rating
from .serializers import CategorySerializer, ProductSerializer, CategoryListSerializer, RatingSerializer, OrderSerializer, OrderItemSerializer, OrderIDSerializer, ProfileSerializer, OrderItemModelSerializer, OrderItemProfileSerializer, CommentSerializer, UserSerializer, IssueTokenRequestSerializer, TokenSerializer
from django.contrib.auth import get_user_model
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.response import Response
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAuthenticatedOrReadOnly
from rest_framework.authtoken.models import Token
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from django.contrib.auth import authenticate
from django.conf import settings

from orders.models import OrderItem, Order, Profile

import braintree


class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategoryListSerializer


class CategoryDetailView(generics.RetrieveAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    lookup_field = 'slug'


class ProductDetailView(generics.RetrieveAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    lookup_field = 'slug'


class UserViewSet(viewsets.ModelViewSet):
    queryset = get_user_model().objects.all()
    serializer_class = UserSerializer


@api_view(['POST'])
@permission_classes([AllowAny])
def issue_token(request):
    serializer = IssueTokenRequestSerializer(data=request.data)
    if serializer.is_valid():
        authenticated_user = authenticate(**serializer.validated_data)
        try:
            token = Token.objects.get(user=authenticated_user)
        except Token.DoesNotExist:
            token = Token.objects.create(user=authenticated_user)
        return Response(TokenSerializer(token).data)
    else:
        return Response(serializer.errors, status=400)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@authentication_classes([SessionAuthentication, TokenAuthentication])
def api_addlike(request, pk, *args, **kwargs):

    if request.method == 'POST':
        post = Comment.objects.get(pk=pk)
        is_dislike = False
        for dislike in post.dislikes.all():
            if dislike == request.user:
                is_dislike = True
                break

        if is_dislike:
            post.dislikes.remove(request.user)

        is_like = False

        for like in post.likes.all():
            if like == request.user:
                is_like = True
                break

        if not is_like:
            post.likes.add(request.user)

        if is_like:
            post.likes.remove(request.user)

        return JsonResponse({"success": True}, status=200)
    else:
        return JsonResponse({"success": False}, status=400)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@authentication_classes([SessionAuthentication, TokenAuthentication])
def api_add_dislike(request, pk, *args, **kwargs):

    if request.method == 'POST':
        post = Comment.objects.get(pk=pk)
        is_like = False
        for like in post.likes.all():
            if like == request.user:
                is_like = True
                break

        if is_like:
            post.likes.remove(request.user)

        is_dislike = False

        for dislike in post.dislikes.all():
            if dislike == request.user:
                is_dislike = True
                break

        if not is_dislike:
            post.dislikes.add(request.user)

        if is_dislike:
            post.dislikes.remove(request.user)
        
        return JsonResponse({"success": True}, status=200)
    else:
        return JsonResponse({"success": False}, status=400)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@authentication_classes([SessionAuthentication, TokenAuthentication])
def api_add_rating(request, pk):
    if request.method == 'POST':
        serializer = RatingSerializer(data=request.data)
        if serializer.is_valid():
            try:
                rating = Rating.objects.get(product=serializer.data['product'], user=request.user)
                rating.stars = serializer.data['stars']
                rating.save()
            except Rating.DoesNotExist:
                product = get_object_or_404(Product, id=serializer.data['product'])
                rating = Rating.objects.create(user=request.user, product=product)
                rating.stars = serializer.data['stars']
                rating.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@authentication_classes([SessionAuthentication, TokenAuthentication])
def api_add_comment(request, pk):
    if request.method == 'POST':
        serializer = CommentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(author=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    else:
        comments = Comment.objects.filter(is_active=True, id=pk)
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data)


@api_view(['POST'])
@permission_classes([AllowAny])
@authentication_classes([SessionAuthentication, TokenAuthentication])
def api_order_create(request):
    if request.method == 'POST':
        serializer = OrderSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save
        order = Order.objects.create(first_name=serializer.data['first_name'],
                             last_name=serializer.data['last_name'],
                             email=serializer.data['email'],
                             address=serializer.data['address'],
                             postal_code=serializer.data['postal_code'],
                             city=serializer.data['city'],
                             )
        if request.user.is_authenticated:
            order.user = request.user
        order.save()
        serializer2 = OrderItemSerializer(data=request.data['cartItems'], many=True)
        if serializer2.is_valid():
                serializer2.save
        for i in range(len(serializer2.data)):
            product = get_object_or_404(Product, pk=serializer2.data[i]['id'])        
            OrderItem.objects.create(order=order,
                                        product=product,
                                        price=serializer2.data[i]['price'],
                                        quantity=serializer2.data[i]['quantity'])
        
        order_id_serializer = OrderSerializer(order)
        return Response(order_id_serializer.data)



gateway = braintree.BraintreeGateway(settings.BRAINTREE_CONF)

@api_view(['GET'])
@permission_classes([AllowAny])
def api_get_token(request):
    client_token = gateway.client_token.generate()
    return Response(client_token)
    


@api_view(['POST'])
@permission_classes([AllowAny])
def api_payment_process(request):
               
    if request.method == 'POST':

        serializer = OrderIDSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save
        order = get_object_or_404(Order, id=serializer.data['orderid'])
        total_cost = order.get_total_cost()
                
        # retrieve nonce
        nonce = request.data.get('paymentMethodNonce', None)
        # create and submit transaction
        result = gateway.transaction.sale({
            'amount': f'{total_cost:.2f}',
            'payment_method_nonce': nonce,
            'options': {
                'submit_for_settlement': True
            }
        })

        if result.is_success:
            # mark the order as paid
            order.paid = True
            # store the unique transaction id
            order.braintree_id = result.transaction.id
            order.save()
            return Response('Payment done')
        else:
            return Response('Payment canceled')
    

@api_view(['GET','POST'])
@permission_classes([IsAuthenticated])
@authentication_classes([SessionAuthentication, TokenAuthentication])
def api_profile(request):
    queryset = Profile.objects.get(user=request.user)
    serializer = ProfileSerializer(queryset)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
@authentication_classes([SessionAuthentication, TokenAuthentication])
def api_profile_orders(request):
    orders = Order.objects.filter(user=request.user)
    serializer = OrderItemProfileSerializer(orders, many=True, context={'request': request})
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@authentication_classes([SessionAuthentication, TokenAuthentication])
def api_profile_update(request):
    if request.method == 'POST':
        serializer = ProfileSerializer(data=request.data)
        if serializer.is_valid():
            profile = Profile.objects.get(user=request.user)
            profile.first_name=serializer.data['first_name']
            profile.last_name=serializer.data['last_name']
            profile.email=serializer.data['email']
            profile.address=serializer.data['address']
            profile.postal_code=serializer.data['postal_code']
            profile.city=serializer.data['city']
            profile.save()
        return Response('Профиль успешно обновлен')

        



        
