

echo "FORCE_DOWNLOAD_CONTOUR : $FORCE_DOWNLOAD_CONTOUR"
echo "FORCE_DOWNLOAD_DATASETS : $FORCE_DOWNLOAD_DATASETS"

if [[ -f 'data/communes-50m.sqlite' ]]; then
    echo "contours already exists."
    if [[ "$FORCE_DOWNLOAD_CONTOUR" = "true" ]]; then
        echo "forcing contours download..."
        npm run prepare-contours
        echo "contours download done."
    fi
else
    echo "contours does not exist."
    echo "downloading contours..."
    npm run prepare-contours
    echo "contours download done."
fi

if [[ -f 'data/communes-locaux-adresses.json' && -f 'data/fantoir.sqlite' && -f 'data/gazetteer.sqlite' ]]; then
    echo "data sets already exist."
    if [[ "$FORCE_DOWNLOAD_DATASETS" = "true" ]]; then
        echo "forcing datasets download..."
        npm run download-datasets
        echo "data sets download done."
    fi
else
    echo "data sets do not exist."
    echo "downloading data sets..."
    npm run download-datasets
    echo "data sets download done."
fi

# npm run import:ign-api-gestion
# npm run import:cadastre
# npm run import:ftth

# npm run apply-batch-certification
# npm run compose
# npm run dist

echo "running migrations..."
npm run migrate:up
echo "migrations done."

pm2-runtime docker-resources/api/process.dev.yml