/* global ReportFactory:false */

(function (QUnit) {

	QUnit.module("ReportFactory methods");

	QUnit.test('ReportFactory.cloudTag should be a valid method', function (assert) {
		assert.equal(typeof ReportFactory.cloudTag, 'function', 'ReportFactory.cloudTag should be a valid method');
	});
	QUnit.test('ReportFactory.reportSummary should be a valid method', function (assert) {
		assert.equal(typeof ReportFactory.reportSummary, 'function', 'ReportFactory.reportSummary should be a valid method');
	});
	QUnit.test('ReportFactory.reporteAlcohol should be a valid method', function (assert) {
		assert.equal(typeof ReportFactory.reporteAlcohol, 'function', 'ReportFactory.reporteAlcohol should be a valid method');
	});
	QUnit.test('ReportFactory.reporteCanasta should be a valid method', function (assert) {
		assert.equal(typeof ReportFactory.reporteCanasta, 'function', 'ReportFactory.reporteCanasta should be a valid method');
	});
	QUnit.test('ReportFactory.reporteComisaria should be a valid method', function (assert) {
		assert.equal(typeof ReportFactory.reporteComisaria, 'function', 'ReportFactory.reporteComisaria should be a valid method');
	});
	QUnit.test('ReportFactory.reporteDemografico should be a valid method', function (assert) {
		assert.equal(typeof ReportFactory.reporteDemografico, 'function', 'ReportFactory.reporteDemografico should be a valid method');
	});
	QUnit.test('ReportFactory.reporteIsocrona should be a valid method', function (assert) {
		assert.equal(typeof ReportFactory.reporteIsocrona, 'function', 'ReportFactory.reporteIsocrona should be a valid method');
	});
	QUnit.test('ReportFactory.reportePivottable should be a valid method', function (assert) {
		assert.equal(typeof ReportFactory.reportePivottable, 'function', 'ReportFactory.reportePivottable should be a valid method');
	});

	QUnit.module("ReportFactory importing reports dinamically");

	QUnit.test('Importing isochrone report with SystemJS should return a constructor', function (assert) {
		var done = assert.async();
		System.import('dist/reports/isochrone_report.js', 'it should be a valid constructor')
			.then(function (resultFN) {
				assert.equal(typeof resultFN, 'function');
				done();
			});
	});

	QUnit.test('Importing infographics report with SystemJS should return a constructor', function (assert) {
		var done = assert.async();
		System.import('dist/reports/infographics.js')
			.then(function (resultFN) {
				assert.equal(typeof resultFN, 'function', 'it should be a valid constructor');
				done();
			});
	});

	QUnit.test('Importing investment report with SystemJS should return a constructor', function (assert) {
		var done = assert.async();
		System.import('dist/reports/investment.js')
			.then(function (resultFN) {
				assert.equal(typeof resultFN, 'function', 'it should be a valid constructor');
				done();
			});
	});

	QUnit.test('Importing summary report with SystemJS should return a constructor', function (assert) {
		var done = assert.async();
		System.import('dist/reports/summary.js')
			.then(function (resultFN) {
				assert.equal(typeof resultFN, 'function', 'it should be a valid constructor');
				done();
			});
	});

})(QUnit);
