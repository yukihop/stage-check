var levels = [
	['debut', 'DEBUT', 'DE'],
	['regular', 'REGULAR', 'RE'],
	['pro', 'PRO', 'PR'],
	['master', 'MASTER', 'MA'],
	['masplus', 'MASTER+', 'M+']
];
var musics;

// Extracts important data from Google Sheet API
function analyzeSheet(data) {
	return data.feed.entry.map(function(entry) {
		var obj = {};
		for (var key in entry) {
			var m;
			if (m = /gsx\$(.+)/.exec(key)) {
				var val = entry[key].$t;
				if (/^\d+$/.test(val)) val = parseInt(val);
				obj[m[1]] = val;
			}
		}
		obj.master_plus = obj.masterpluslv > 0;
		return obj;
	});
}

var source = 'https://spreadsheets.google.com/feeds/list/1jGNh06Bv94jxZKByO1aWI-uPXP7Ox7xXYtrhhgRDjoI/od6/public/values?alt=json';
$.get(source, null, null, 'json')
.then(function(data) {
	var table = $('#list tbody');
	var musics = analyzeSheet(data);

	musics.forEach(function(music) {
		var id = music.id;
		var title  = music.title;
		var type = music.type;
		var category = music.category;
		var master_plus = music.master_plus;
		if (!title) return;
		var tr = $('<tr>').addClass(type).addClass(category).data('music-id', id).appendTo(table);
		$('<th>').text(title).appendTo(tr);
		var cell = $('<td>').addClass('checks').appendTo(tr);
		levels.forEach(function(lv) {
			var lv_id = lv[0];
			var lv_long = lv[1];
			var lv_short = lv[2];
			if (master_plus != 'true' && lv_id === 'masplus') return;
			var cid = 'm-' + id + '-' + lv_id;
			var check = $('<input type="checkbox">').attr('id', cid).addClass(lv_id).appendTo(cell);
			var label = $('<label>').attr('for', cid).appendTo(cell);
			$('<span>').addClass('level-full').text(lv_long).appendTo(label);
			$('<span>').addClass('level-short').text(lv_short).appendTo(label);
		});
	});
	applyFilter();

	var tmp = localStorage.getItem('clearData');
	var clearData = {};
	try {
		if (typeof tmp == 'string' && tmp.length > 0) clearData = JSON.parse(tmp);
	} catch (e) {
		//
	}
	load(clearData);
});

$('table').on('click', 'input', update);

$('#filter').on('change', () => { applyFilter(); update(); });

function applyFilter() {
	var visibles = $('#filter input:checked').get().map(function(b) { return $(b).val(); });
	$('tr').each(function() {
		var row = $(this);
		var flag = visibles.some(function(c) { return row.hasClass(c); });
		$(this).toggle(flag);
	});
}

$('#clear').on('click', function() {
	bootbox.confirm('クリアデータを消去します', function(result) {
		if (result) load({});
	});
});

$('#export').on('click', function() {
	var text = btoa(JSON.stringify(makeSaveData()));
	bootbox.dialog({
		title: 'この文字列をコピーしてどこかに保存すれば、データをバックアップしたり、他のブラウザに転送したりできます。',
		message: $('<textarea class="inout">').val(text).click(function() { this.select(); }),
		buttons: { OK: { label: 'OK'}},
		callback: $.noop
	});
});

$('#import').on('click', function() {
	bootbox.prompt({
		title: '以前にエクスポートした文字列データからチェック情報を復元します（現在表示されているデータは消えてしまいます）。',
		callback: function(result) {
			if (result === null) return;
			try {
				var data = JSON.parse(atob(result));
				load(data);
			} catch (e) {
				bootbox.alert('入力されたデータが不正です');
			}
		}
	});
});

bootbox.setDefaults({ locale: 'ja', animate: false });

function update() {
	var checked_total = 0;
	var checkable_total = 0;
	var counts = levels.map(function(lv) {
		var lv_id = lv[0];
		var lv_short = lv[2];
		var checked = $('tr:visible input:checked').filter('.' + lv_id).length;
		var checkable = $('tr:visible input').filter('.' + lv_id).length;
		checked_total += checked;
		checkable_total += checkable;
		return lv_short + " " + checked + '/' + checkable;
	});
	$('#summary').text(counts.join('; ') + '; TOTAL ' + checked_total + '/' + checkable_total);
	save();
}

function load(data) {
	$('#list tr').each(function () {
		var id = $(this).data('music-id');
		$(':checkbox', this).each(function () {
			var dif = $(this).attr('class');
			$(this).prop('checked', id in data && data[id][dif]);
		});
	});
	update();
}

function makeSaveData() {
	var data = {};
	$('#list tr').each(function () {
		var id = $(this).data('music-id');
		var flags = {};
		$('input', this).each(function (input) {
			flags[$(this).attr('class')] = $(this).is(':checked')
		});
		data[id] = flags;
	});
	return data;
}

function save() {
	var data = makeSaveData();
	localStorage.setItem('clearData', JSON.stringify(data));
}

// Google analytics
if (location.href.match(/github/)) {
	(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
	(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
	m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
	})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
	ga('create', 'UA-68109293-1', 'auto');
	ga('send', 'pageview');
}
