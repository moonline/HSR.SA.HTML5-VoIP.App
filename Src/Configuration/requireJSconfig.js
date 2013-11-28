require.config({
	baseUrl: ".",
	paths: {
		"Configuration": "../Configuration/appConfiguration",
		"Handlebars": "Core/Lib/Handlebars/handlebars",
		"jQuery": "Core/Lib/JQuery/jQuery.2.0.3"
	},
	shim: {
		Handlebars: {
			exports: "Handlebars"
		},
		jQuery: {
			exports: "jQuery"
		}
	}
});