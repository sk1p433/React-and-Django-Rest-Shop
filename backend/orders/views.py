from django.conf import settings
from django.http import HttpResponse
from django.template.loader import render_to_string
from django.dispatch import receiver
from django.shortcuts import render, redirect, get_object_or_404
from django.urls import reverse
from .models import OrderItem, Profile, Order
from .forms import OrderCreateForm, ProfileCreateForm
from cart.cart import Cart
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.db.models.signals import post_save
from django.contrib.admin.views.decorators import staff_member_required
#import weasyprint

#import os

#os.add_dll_directory(r"C:\Program Files\GTK3-Runtime Win64\bin")

#from weasyprint import HTML

#HTML('https://weasyprint.org/').write_pdf('weasyprint-website.pdf')


# Create your views here.

def order_create(request):
    cart = Cart(request)
    if request.method == 'POST':
        form = OrderCreateForm(request.POST)
        if form.is_valid():
            order = form.save(commit=False)
            if request.user.is_authenticated:
                order.user = request.user
            order.save()
            for item in cart:
                OrderItem.objects.create(order=order,
                                        product=item['product'],
                                        price=item['price'],
                                        quantity=item['quantity'])
            # clear the cart
            cart.clear()
            # set the order in the session
            request.session['order_id'] = order.id
            # redirect for payment
            return redirect(reverse('payment:process'))
    else:
        form = OrderCreateForm()
        if request.user.is_authenticated:
            initial_data = {
                'first_name': request.user.profile.first_name,
                'last_name': request.user.profile.last_name,
                'email': request.user.profile.email,
                'address': request.user.profile.address,
                'postal_code': request.user.profile.postal_code,
                'city': request.user.profile.city,
                }
            form = OrderCreateForm(initial=initial_data)

    return render(request,'orders/order/create.html',{'cart': cart, 'form': form})


@login_required
def profile(request):
    user = None
    if request.method == 'POST':
        profile_form = ProfileCreateForm(instance=request.user.profile, data=request.POST)
        if profile_form.is_valid():
            profile_form.save()
            messages.success(request, 'Профиль был успешно обновлен')
            return redirect('orders:profile')
    else:
        profile_form = ProfileCreateForm(instance=request.user.profile)

    return render(request, 'orders/profile.html', {'profile_form': profile_form})


#при регистрации подаётся сигнал создать новый профиль для данного юзера
from django.contrib.auth import get_user_model
User = get_user_model()

@receiver(post_save, sender=User)
def create_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)

@staff_member_required
def admin_order_detail(request, order_id):
    order = get_object_or_404(Order, id=order_id)
    return render(request, 'admin/orders/order/detail.html', {'order':order})


@staff_member_required
def admin_order_pdf(request, order_id):
    order = get_object_or_404(Order, id=order_id)
    html = render_to_string('orders/order/pdf.html', {'order': order})
    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = f'filename=order_{order.id}.pdf'
    weasyprint.HTML(string=html).write_pdf(response, stylesheets=[weasyprint.CSS(settings.STATIC_ROOT + 'css/pdf.css')])
    return response
