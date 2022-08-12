from django.contrib.auth import login
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib.auth.views import LoginView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views import View
from django.core.paginator import Paginator
from django.http import JsonResponse
from django.shortcuts import render, redirect
from django.urls import reverse_lazy
from django.views.generic import ListView, DetailView, CreateView
from django.views.generic.edit import FormMixin

from cart.forms import CartAddProductForm
from .forms import UserCommentForm
from .models import Category, Product, Comment
from .serializers import CommentSerializer
from rest_framework.response import Response
from rest_framework.decorators import api_view


# Create your views here.

def index(request):
    products = Product.objects.all()[:3]
    context = {'products': products}
    return render(request, 'store/index.html', context)


class ShowCategories(ListView):
    model = Category
    template_name = 'store/categories.html'


class ShowCategory(DetailView):
    model = Category
    template_name = 'store/category.html'
    slug_url_kwarg = 'category_slug'


class ShowProduct(FormMixin, DetailView):
    model = Product
    template_name = 'store/product.html'
    slug_url_kwarg = 'product_slug'
    form_class = UserCommentForm

    def get_success_url(self):
        return self.object.get_absolute_url()

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['form'] = UserCommentForm(initial={'product': self.object})
        context['cart_product_form'] = CartAddProductForm()
        context['comments'] = self.object.comment_set.order_by('-created_at')
        paginator = Paginator(context['comments'], 3)
        page_number = self.request.GET.get('page')
        context['comments'] = paginator.get_page(page_number)
        return context


def show_shops(request):
    return render(request, 'store/shops.html')


def about_us(request):
    return render(request, 'store/about.html')


class RegisterUser(CreateView):
    form_class = UserCreationForm
    template_name = 'registration/register.html'
    success_url = reverse_lazy('store:index')

    def form_valid(self,form):
        user = form.save()
        login(self.request, user)
        return redirect('store:index')


class LoginUser(LoginView):
    form_class = AuthenticationForm
    template_name = 'registration/login.html'
    success_url = reverse_lazy('store:index')


@api_view(['POST'])
def ajax_receiver(request):
    is_ajax = request.META.get('HTTP_X_REQUESTED_WITH') == 'XMLHttpRequest'
    if request.method == 'POST' and is_ajax and request.user.is_authenticated:
        form = UserCommentForm(data=request.POST)
        if form.is_valid():
            new_comment = form.save(commit=False)
            new_comment.author = request.user
            new_comment.save()
            serializer = CommentSerializer(new_comment, many=False)
            return Response(serializer.data)

    else:
        return JsonResponse({"success": False}, status=400)


@login_required
def addlike(request, pk, *args, **kwargs):

        is_ajax = request.META.get('HTTP_X_REQUESTED_WITH') == 'XMLHttpRequest'
        if request.method == 'POST' and is_ajax:

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

            all_post_likes = post.total_likes()
            all_post_dislikes = post.total_dislikes()
            return JsonResponse({"success": True, "like_count": all_post_likes, "dislike_count": all_post_dislikes, "id": pk}, status=200)
        else:

            return JsonResponse({"success": False}, status=400)


class AddDislike(LoginRequiredMixin, View):
    def post(self, request, pk, *args, **kwargs):

        is_ajax = request.META.get('HTTP_X_REQUESTED_WITH') == 'XMLHttpRequest'
        if request.method == 'POST' and is_ajax:
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

            all_post_likes = post.total_likes()
            all_post_dislikes = post.total_dislikes()
            return JsonResponse({"success": True, "dislike_count": all_post_dislikes, "like_count": all_post_likes, "id": pk}, status=200)
        else:

            return JsonResponse({"success": False}, status=400)
