from rest_framework import viewsets
from app.models.models import AppDownload
from app.serializers.appDownload import AppDownloadReadSerializer, AppDownloadWriteSerializer

class AppDownloadViewSet(viewsets.ModelViewSet):
    queryset = AppDownload.objects.all()

    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return AppDownloadReadSerializer
        return AppDownloadWriteSerializer
