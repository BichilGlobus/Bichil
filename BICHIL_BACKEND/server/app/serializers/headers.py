from rest_framework import serializers
from app.models.models import (
    Header, HeaderStyle, HeaderMenu, HeaderMenuTranslation,
    HeaderSubmenu, HeaderSubmenuTranslation,
    HeaderTertiaryMenu, HeaderTertiaryMenuTranslation,
)

class HeaderMenuTranslationSerializer(serializers.ModelSerializer):
    language_id = serializers.IntegerField(source='language.id')

    class Meta:
        model = HeaderMenuTranslation
        fields = ['id', 'label', 'language_id']

class HeaderSubmenuTranslationSerializer(serializers.ModelSerializer):
    language_id = serializers.IntegerField(source='language.id')

    class Meta:
        model = HeaderSubmenuTranslation
        fields = ['id', 'label', 'language_id']

class HeaderTertiaryMenuTranslationSerializer(serializers.ModelSerializer):
    language_id = serializers.IntegerField(source='language.id')

    class Meta:
        model = HeaderTertiaryMenuTranslation
        fields = ['id', 'label', 'language_id']

class HeaderTertiaryMenuSerializer(serializers.ModelSerializer):
    translations = HeaderTertiaryMenuTranslationSerializer(source='headertertiarymenutranslation_set', many=True, read_only=True)

    class Meta:
        model = HeaderTertiaryMenu
        fields = ['id', 'path', 'font', 'index', 'visible', 'translations']

class HeaderSubmenuSerializer(serializers.ModelSerializer):
    translations = HeaderSubmenuTranslationSerializer(source='headersubmenutranslation_set', many=True, read_only=True)
    tertiary_menus = HeaderTertiaryMenuSerializer(source='headertertiarymenu_set', many=True, read_only=True)

    class Meta:
        model = HeaderSubmenu
        fields = ['id', 'path', 'font', 'index', 'visible', 'translations', 'tertiary_menus']

class HeaderMenuSerializer(serializers.ModelSerializer):
    translations = HeaderMenuTranslationSerializer(source='headermenutranslation_set', many=True, read_only=True)
    submenus = HeaderSubmenuSerializer(source='headersubmenu_set', many=True, read_only=True)

    class Meta:
        model = HeaderMenu
        fields = ['id', 'path', 'font', 'index', 'visible', 'translations', 'submenus']

class HeaderStyleSerializer(serializers.ModelSerializer):
    class Meta:
        model = HeaderStyle
        fields = ['id', 'bgcolor', 'fontcolor', 'hovercolor', 'height', 'sticky']

class HeaderSerializer(serializers.ModelSerializer):
    menus = HeaderMenuSerializer(source='headermenu_set', many=True, read_only=True)
    styles = HeaderStyleSerializer(source='headerstyle_set', many=True, read_only=True)

    class Meta:
        model = Header
        fields = ['id', 'logo', 'active', 'styles', 'menus']

class HeaderCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Header
        fields = ['logo', 'active']
