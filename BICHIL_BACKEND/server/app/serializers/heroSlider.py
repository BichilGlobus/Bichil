from rest_framework import serializers
from app.models.models import HeroSlider


class HeroSliderSerializer(serializers.ModelSerializer):
    class Meta:
        model = HeroSlider
        fields = "__all__"
