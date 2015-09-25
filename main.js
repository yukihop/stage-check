var levels = ['debut', 'regular', 'pro', 'master'];
var musics;

$.get('musics.csv')
.then(function(text) {
	var table = $('#list tbody');
	musics =
		text.split(/\n/).map(function(line) {
			return line.split(',').map(function(s) { return s.trim(); });
		});

	musics.forEach(function(music) {
		var id = music[0];
		var title  = music[1];
		var attr = music[2];
		var type = music[3];
		if (!title) return;
		var tr = $('<tr>').addClass(attr).addClass(type).data('music-id', id).appendTo(table);
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

$('#filter').on('change', function() {
	var visibles = $('#filter input:checked').val().split('+');
	console.log(visibles);
	$('tr').each(function() {
		var row = $(this);
		var flag = visibles.some(function(c) { return row.hasClass(c); });
		$(this).toggle(flag);
	});
	update();
});

$('#clear').on('click', function() {
	bootbox.confirm('クリアデータを消去します', function(result) {
		if (result) load({});
	});
});

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

function save() {
	var data = {};
	$('#list tr').each(function () {
		var id = $(this).data('music-id');
		var flags = {};
		$('input', this).each(function (input) {
			flags[$(this).attr('class')] = $(this).is(':checked')
		});
		data[id] = flags;
	});
	localStorage.setItem('clearData', JSON.stringify(data));
}
