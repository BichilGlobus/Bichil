from rest_framework import serializers
from app.models.models import HeaderStyle

class HeaderStyleSerializer(serializers.ModelSerializer):
    class Meta:
        model = HeaderStyle
        fields = ('id', 'header', 'bgcolor', 'fontcolor', 'hovercolor', 'height', 'sticky')
