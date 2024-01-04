export const vitePWAConf = {
    includeAssets: ['ico.svg', 'icoKnowItAll.png'],
    registerType: 'autoUpdate',
    injectRegister: 'inline',
    devOptions: {
        enabled: true
    },
    manifest: {
        name: 'Всезнайка',
        short_name: "Всезнайка",
        description: "Легкое приложение для тренировки и проверки знаний таблицы умножения для школьников и взрослых.",
        display: "standalone",
        theme_color: "#fff",
        background_color: "#fff",
        icons: [
            {
                "src": "ico.svg",
                "sizes": "any",
                "type": "image/svg+xml",
            },
            {
                "src": "icoKnowItAll.png",
                "sizes": "512x512",
                "type": "image/png",
            },
            {
                "src": "ico.svg",
                "sizes": "196x196",
                "type": "svg+xml",
                "purpose": "any maskable"
            }
        ],
    }
}