var levels = ['debut', 'regular', 'pro', 'master'];
var musics;

$.get('musics.csv')
.then(function(text) {
	var table = $('#list tbody');
	musics =
		text.split(/\n/).slice(1).map(function(line) {
			return line.split(',').map(function(s) { return s.trim(); });
		});

	musics.forEach(function(music) {
		var id = music[0];
		var title  = music[1];
		var type = music[2];
		var category = music[3];
		if (!title) return;
		var tr = $('<tr>').addClass(type).addClass(category).data('music-id', id).appendTo(table);
		$('<th>').text(title).appendTo(tr);
		var cell = $('<td>').addClass('checks').appendTo(tr);
		levels.forEach(function(dif) {
			var cid = 'm-' + id + '-' + dif;
			var check = $('<input type="checkbox">').attr('id', cid).addClass(dif).appendTo(cell);
			var label = $('<label>').attr('for', cid).appendTo(cell);
			$('<span>').addClass('level-full').text(dif.toUpperCase()).appendTo(label);
			$('<span>').addClass('level-short').text(dif.substr(0, 2).toUpperCase()).appendTo(label);
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
	var total = 0;
	var visibleMusics = $('tr:visible').length;
	var counts = levels.map(function(dif) {
		var count = $('tr:visible input:checked').filter('.' + dif).length;
		total += count;
		return dif.toUpperCase() + " " + count + '/' + visibleMusics;
	});
	$('#summary').text(counts.join('; ') + '; TOTAL ' + total + '/' + visibleMusics * levels.length);
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
