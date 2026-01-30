from rest_framework import viewsets
from app.models.models import HeaderMenu
from app.serializers.headersMenu import HeaderMenuSerializer

class HeaderMenuViewSet(viewsets.ModelViewSet):
    queryset = HeaderMenu.objects.all()
    serializer_class = HeaderMenuSerializer
