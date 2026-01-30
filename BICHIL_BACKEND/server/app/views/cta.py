from rest_framework.viewsets import ModelViewSet
from app.models.models import Cta
from app.serializers.cta import CtaSerializer

class CtaViewSet(ModelViewSet):

    queryset = Cta.objects.all().order_by("index")
    serializer_class = CtaSerializer
