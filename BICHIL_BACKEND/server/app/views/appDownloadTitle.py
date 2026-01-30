from rest_framework import viewsets
from app.models.models import AppDownloadTitle
from app.serializers.appDownloadTitle import AppDownloadTitleSerializer

class AppDownloadTitleViewSet(viewsets.ModelViewSet):
    queryset = AppDownloadTitle.objects.all()
    serializer_class = AppDownloadTitleSerializer
