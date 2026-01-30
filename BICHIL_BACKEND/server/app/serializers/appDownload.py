from rest_framework import serializers
from app.models.models import (
    AppDownload, AppDownloadList, AppDownloadListTranslation,
    AppDownloadTitle, AppDownloadTitleTranslation, AppDownloadTitlePosition,
    Language
)

class AppDownloadListTranslationSerializer(serializers.ModelSerializer):
    language_id = serializers.PrimaryKeyRelatedField(
        source='language', queryset=Language.objects.all()
    )

    class Meta:
        model = AppDownloadListTranslation
        fields = ['id', 'label', 'language_id']


class AppDownloadListSerializer(serializers.ModelSerializer):
    translations = AppDownloadListTranslationSerializer(
        source='appdownloadlisttranslation_set', many=True, read_only=True
    )

    class Meta:
        model = AppDownloadList
        fields = ['id', 'translations']


class AppDownloadTitleTranslationSerializer(serializers.ModelSerializer):
    language_id = serializers.PrimaryKeyRelatedField(
        source='language', queryset=Language.objects.all()
    )

    class Meta:
        model = AppDownloadTitleTranslation
        fields = ['id', 'label', 'language_id']


class AppDownloadTitlePositionSerializer(serializers.ModelSerializer):
    class Meta:
        model = AppDownloadTitlePosition
        fields = ['id', 'top', 'left', 'rotate', 'size']

class AppDownloadTitleSerializer(serializers.ModelSerializer):
    translations = AppDownloadTitleTranslationSerializer(
        source='appdownloadtitletranslation_set', many=True, read_only=True
    )
    positions = AppDownloadTitlePositionSerializer(
        source='appdownloadtitleposition_set', many=True, read_only=True
    )

    class Meta:
        model = AppDownloadTitle
        fields = ['id', 'translations', 'positions']


class AppDownloadReadSerializer(serializers.ModelSerializer):
    lists = AppDownloadListSerializer(
        source='appdownloadlist_set', many=True, read_only=True
    )
    titles = AppDownloadTitleSerializer(
        source='appdownloadtitle_set', many=True, read_only=True
    )

    class Meta:
        model = AppDownload
        fields = [
            "id", "image", "appstore", "playstore", "title_position", "divide",
            "font", "titlecolor", "fontcolor", "listcolor", "iconcolor",
            "buttonbgcolor", "buttonfontcolor",
            "lists", "titles"
        ]


class AppDownloadWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = AppDownload
        fields = [
            "id", "image", "appstore", "playstore", "title_position", "divide",
            "font", "titlecolor", "fontcolor", "listcolor", "iconcolor",
            "buttonbgcolor", "buttonfontcolor"
        ]
