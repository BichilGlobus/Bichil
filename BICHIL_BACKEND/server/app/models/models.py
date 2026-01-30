# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class Cta(models.Model):
    id = models.BigAutoField(primary_key=True)
    file = models.TextField(blank=True, null=True)
    index = models.SmallIntegerField(blank=True, null=True)
    font = models.TextField(blank=True, null=True)
    color = models.TextField(blank=True, null=True)  # This field type is a guess.
    number = models.TextField(blank=True, null=True)  # This field type is a guess.

    class Meta:
        managed = False
        db_table = 'CTA'


class CtaSubtitle(models.Model):
    id = models.BigAutoField(primary_key=True)
    cta = models.ForeignKey(Cta, models.DO_NOTHING, db_column='cta', blank=True, null=True)
    language = models.ForeignKey('Language', models.DO_NOTHING, db_column='language', blank=True, null=True)
    label = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'CTA_subtitle'


class CtaTitle(models.Model):
    id = models.BigAutoField(primary_key=True)
    language = models.ForeignKey('Language', models.DO_NOTHING, db_column='language', blank=True, null=True)
    label = models.TextField(blank=True, null=True)
    cta = models.ForeignKey(Cta, models.DO_NOTHING, db_column='cta', blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'CTA_title'


class AppDownload(models.Model):
    id = models.BigAutoField(primary_key=True)
    image = models.TextField(blank=True, null=True)
    appstore = models.TextField(blank=True, null=True)
    playstore = models.TextField(blank=True, null=True)
    title_position = models.SmallIntegerField(blank=True, null=True)
    divide = models.SmallIntegerField(blank=True, null=True)
    font = models.TextField(blank=True, null=True)  # This field type is a guess.
    titlecolor = models.TextField(db_column='titleColor', blank=True, null=True)  # Field name made lowercase. This field type is a guess.
    fontcolor = models.TextField(db_column='fontColor', blank=True, null=True)  # Field name made lowercase. This field type is a guess.
    listcolor = models.TextField(db_column='listColor', blank=True, null=True)  # Field name made lowercase. This field type is a guess.
    iconcolor = models.TextField(db_column='iconColor', blank=True, null=True)  # Field name made lowercase. This field type is a guess.
    buttonbgcolor = models.TextField(db_column='buttonBgColor', blank=True, null=True)  # Field name made lowercase. This field type is a guess.
    buttonfontcolor = models.TextField(db_column='buttonFontColor', blank=True, null=True)  # Field name made lowercase. This field type is a guess.

    class Meta:
        managed = False
        db_table = 'app_download'


class AppDownloadList(models.Model):
    id = models.BigAutoField(primary_key=True)
    app_download = models.ForeignKey(AppDownload, models.DO_NOTHING, db_column='app_download', blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'app_download_list'


class AppDownloadListTranslation(models.Model):
    id = models.BigAutoField(primary_key=True)
    app_download_list = models.ForeignKey(AppDownloadList, models.DO_NOTHING, db_column='app_download_list', blank=True, null=True)
    language = models.ForeignKey('Language', models.DO_NOTHING, db_column='language', blank=True, null=True)
    label = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'app_download_list_translation'


class AppDownloadTitle(models.Model):
    id = models.BigAutoField(primary_key=True)
    app_download = models.ForeignKey(AppDownload, models.DO_NOTHING, db_column='app_download', blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'app_download_title'


class AppDownloadTitlePosition(models.Model):
    id = models.BigAutoField(primary_key=True)
    app_download_title = models.ForeignKey(AppDownloadTitle, models.DO_NOTHING, db_column='app_download_title', blank=True, null=True)
    top = models.SmallIntegerField(blank=True, null=True)
    left = models.SmallIntegerField(blank=True, null=True)
    rotate = models.SmallIntegerField(blank=True, null=True)
    size = models.SmallIntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'app_download_title_position'


class AppDownloadTitleTranslation(models.Model):
    id = models.BigAutoField(primary_key=True)
    app_download_title = models.ForeignKey(AppDownloadTitle, models.DO_NOTHING, db_column='app_download_title', blank=True, null=True)
    language = models.ForeignKey('Language', models.DO_NOTHING, db_column='language', blank=True, null=True)
    label = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'app_download_title_translation'


class Category(models.Model):
    id = models.BigAutoField(primary_key=True)

    class Meta:
        managed = False
        db_table = 'category'


class CategoryTranslations(models.Model):
    id = models.BigAutoField(primary_key=True)
    category = models.ForeignKey(Category, models.DO_NOTHING, db_column='category', blank=True, null=True)
    language = models.ForeignKey('Language', models.DO_NOTHING, db_column='language', blank=True, null=True)
    label = models.TextField(blank=True, null=True)
    

    class Meta:
        managed = False
        db_table = 'category_translations'


class Collateral(models.Model):
    id = models.BigAutoField(primary_key=True)

    class Meta:
        managed = False
        db_table = 'collateral'


class CollateralTranslation(models.Model):
    id = models.BigAutoField(primary_key=True)
    collateral = models.ForeignKey(Collateral, models.DO_NOTHING, db_column='collateral', blank=True, null=True)
    language = models.ForeignKey('Language', models.DO_NOTHING, db_column='language', blank=True, null=True)
    label = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'collateral_translation'


class Document(models.Model):
    id = models.BigAutoField(primary_key=True)

    class Meta:
        managed = False
        db_table = 'document'


class DocumentTranslation(models.Model):
    id = models.BigAutoField(primary_key=True)
    document = models.ForeignKey(Document, models.DO_NOTHING, db_column='document', blank=True, null=True)
    language = models.ForeignKey('Language', models.DO_NOTHING, db_column='language', blank=True, null=True)
    label = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'document_translation'


class Font(models.Model):
    id = models.BigIntegerField(primary_key=True)
    font = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'font'


class Footer(models.Model):
    id = models.BigAutoField(primary_key=True)
    logotext = models.TextField(db_column='logoText', blank=True, null=True)  # Field name made lowercase. This field type is a guess.
    facebook = models.TextField(blank=True, null=True)
    instagram = models.TextField(blank=True, null=True)
    twitter = models.TextField(blank=True, null=True)
    bgcolor = models.TextField(db_column='bgColor', blank=True, null=True)  # Field name made lowercase. This field type is a guess.
    fontcolor = models.TextField(db_column='fontColor', blank=True, null=True)  # Field name made lowercase. This field type is a guess.
    accentcolor = models.TextField(db_column='accentColor', blank=True, null=True)  # Field name made lowercase. This field type is a guess.
    iconcolor = models.TextField(db_column='iconColor', blank=True, null=True)  # Field name made lowercase. This field type is a guess.
    titlesize = models.SmallIntegerField(db_column='titleSize', blank=True, null=True)  # Field name made lowercase.
    fontsize = models.SmallIntegerField(db_column='fontSize', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'footer'


class FooterTranslations(models.Model):
    id = models.BigAutoField(primary_key=True)
    footer = models.ForeignKey(Footer, models.DO_NOTHING, db_column='footer', blank=True, null=True)
    language = models.ForeignKey('Language', models.DO_NOTHING, db_column='language', blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    location = models.TextField(blank=True, null=True)
    copyright = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'footer_translations'


class Header(models.Model):
    id = models.BigAutoField(primary_key=True)
    logo = models.TextField(blank=True, null=True)
    active = models.SmallIntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'header'
        db_table_comment = 'Headeer'


class HeaderMenu(models.Model):
    id = models.BigAutoField(primary_key=True)
    header = models.ForeignKey(Header, models.DO_NOTHING, db_column='header', blank=True, null=True)
    font = models.BigIntegerField(blank=True, null=True)
    path = models.TextField(blank=True, null=True)
    index = models.SmallIntegerField(blank=True, null=True)
    visible = models.SmallIntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'header_menu'


class HeaderMenuTranslation(models.Model):
    id = models.BigAutoField(primary_key=True)
    menu = models.ForeignKey(HeaderMenu, models.DO_NOTHING, db_column='menu', blank=True, null=True)
    language = models.ForeignKey('Language', models.DO_NOTHING, db_column='language', blank=True, null=True)
    label = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'header_menu_translation'


class HeaderStyle(models.Model):
    id = models.BigAutoField(primary_key=True)
    header = models.ForeignKey(Header, models.DO_NOTHING, db_column='header', blank=True, null=True)
    bgcolor = models.TextField(db_column='bgColor', blank=True, null=True)  # Field name made lowercase.
    fontcolor = models.TextField(db_column='fontColor', blank=True, null=True)  # Field name made lowercase.
    hovercolor = models.TextField(db_column='hoverColor', blank=True, null=True)  # Field name made lowercase.
    height = models.SmallIntegerField(blank=True, null=True)
    sticky = models.SmallIntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'header_style'


class HeaderSubmenu(models.Model):
    id = models.BigAutoField(primary_key=True)
    header_menu = models.ForeignKey(HeaderMenu, models.DO_NOTHING, db_column='header_menu', blank=True, null=True)
    font = models.BigIntegerField(blank=True, null=True)
    path = models.TextField(blank=True, null=True)
    index = models.SmallIntegerField(blank=True, null=True)
    visible = models.SmallIntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'header_submenu'


class HeaderSubmenuTranslation(models.Model):
    id = models.BigAutoField(primary_key=True)
    submenu = models.ForeignKey(HeaderSubmenu, models.DO_NOTHING, db_column='submenu', blank=True, null=True)
    language = models.ForeignKey('Language', models.DO_NOTHING, db_column='language', blank=True, null=True)
    label = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'header_submenu_translation'


class HeaderTertiaryMenu(models.Model):
    id = models.BigAutoField(primary_key=True)
    header_submenu = models.ForeignKey(HeaderSubmenu, models.DO_NOTHING, db_column='header_submenu', blank=True, null=True)
    font = models.TextField(blank=True, null=True)
    path = models.TextField(blank=True, null=True)
    index = models.SmallIntegerField(blank=True, null=True)
    visible = models.SmallIntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'header_tertiary_menu'


class HeaderTertiaryMenuTranslation(models.Model):
    id = models.BigAutoField(primary_key=True)
    tertiary_menu = models.ForeignKey(HeaderTertiaryMenu, models.DO_NOTHING, db_column='tertiary_menu', blank=True, null=True)
    language = models.ForeignKey('Language', models.DO_NOTHING, db_column='language', blank=True, null=True)
    label = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'header_tertiary_menu_translation'


class HeroSlider(models.Model):
    id = models.BigAutoField(primary_key=True)
    type = models.TextField(blank=True, null=True)  # This field type is a guess.
    file = models.TextField(blank=True, null=True)
    time = models.SmallIntegerField(blank=True, null=True)
    index = models.SmallIntegerField(blank=True, null=True)
    visible = models.BooleanField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'hero_slider'


class Language(models.Model):
    id = models.BigAutoField(primary_key=True)
    lang_code = models.TextField(blank=True, null=True)
    lang_name = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'language'


class Product(models.Model):
    id = models.BigAutoField(primary_key=True)
    product_type = models.ForeignKey('ProductType', models.DO_NOTHING, db_column='product_type', blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'product'


class ProductCollaterial(models.Model):
    id = models.BigAutoField(primary_key=True)
    product = models.ForeignKey(Product, models.DO_NOTHING, db_column='product', blank=True, null=True)
    collateral = models.ForeignKey(Collateral, models.DO_NOTHING, db_column='collateral', blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'product_collaterial'


class ProductCondition(models.Model):
    id = models.BigAutoField(primary_key=True)
    product = models.ForeignKey(Product, models.DO_NOTHING, db_column='product', blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'product_condition'


class ProductConditionTranslation(models.Model):
    id = models.BigAutoField(primary_key=True)
    condition = models.ForeignKey(ProductCondition, models.DO_NOTHING, db_column='condition', blank=True, null=True)
    language = models.ForeignKey(Language, models.DO_NOTHING, db_column='language', blank=True, null=True)
    label = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'product_condition_translation'


class ProductDetails(models.Model):
    id = models.BigAutoField(primary_key=True)
    product = models.ForeignKey(Product, models.DO_NOTHING, db_column='product', blank=True, null=True)
    amount = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    min_fee_percent = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    max_fee_percent = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    min_interest_rate = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    max_interest_rate = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    term_months = models.SmallIntegerField(blank=True, null=True)
    min_processing_hours = models.SmallIntegerField(blank=True, null=True)
    max_processing_hoyrs = models.SmallIntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'product_details'


class ProductDocument(models.Model):
    id = models.BigAutoField(primary_key=True)
    product = models.ForeignKey(Product, models.DO_NOTHING, db_column='product', blank=True, null=True)
    document = models.ForeignKey(Document, models.DO_NOTHING, db_column='document', blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'product_document'


class ProductTranslations(models.Model):
    id = models.BigAutoField(primary_key=True)
    product = models.ForeignKey(Product, models.DO_NOTHING, db_column='product', blank=True, null=True)
    language = models.ForeignKey(Language, models.DO_NOTHING, db_column='language', blank=True, null=True)
    label = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'product_translations'


class ProductType(models.Model):
    id = models.BigAutoField(primary_key=True)
    category = models.ForeignKey(Category, models.DO_NOTHING, db_column='category', blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'product_type'


class ProductTypeTranslations(models.Model):
    id = models.BigAutoField(primary_key=True)
    product_type = models.ForeignKey(ProductType, models.DO_NOTHING, db_column='product_type', blank=True, null=True)
    language = models.ForeignKey(Language, models.DO_NOTHING, db_column='language', blank=True, null=True)
    label = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'product_type_translations'
