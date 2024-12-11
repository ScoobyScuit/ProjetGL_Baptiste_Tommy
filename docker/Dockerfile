FROM php:8.2-apache

# Installer les extensions nécessaires, y compris PDO MySQL
RUN docker-php-ext-install pdo pdo_mysql

# Copier les fichiers dans le répertoire d'Apache
COPY ../login/index.html /var/www/html/index.html
COPY ../dashboard /var/www/html/dashboard
COPY ../fichiers_include_PHP /var/www/html/fichiers_include_PHP
COPY ../js_class /var/www/html/js_class
COPY ../login /var/www/html/login
COPY ../logout /var/www/html/logout
COPY ../test /var/www/html/test

# Ajouter la configuration Apache
COPY ../docker/apache.conf /etc/apache2/sites-available/000-default.conf

# Activer les modules Apache nécessaires
RUN a2enmod rewrite

# Configurer les permissions pour Apache
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html
