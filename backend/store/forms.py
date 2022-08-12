from django import forms

from .models import Comment



class UserCommentForm(forms.ModelForm):
    class Meta:
        model = Comment
        exclude = ('is_active','author','likes','dislikes')
        widgets = {'product': forms.HiddenInput}
