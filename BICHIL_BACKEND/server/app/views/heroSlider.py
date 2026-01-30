from rest_framework.viewsets import ModelViewSet
from rest_framework.filters import OrderingFilter

from app.models.models import HeroSlider
from app.serializers.heroSlider import HeroSliderSerializer


class HeroSliderViewSet(ModelViewSet):
    queryset = HeroSlider.objects.all()
    serializer_class = HeroSliderSerializer
