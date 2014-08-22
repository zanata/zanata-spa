(function () {
  'use strict';

/**
 * @name PhraseService
 * @description Provides a list of phrases for the current document(s)
 */
function PhraseService ($q, $filter) {
  var phraseService = {};
  var phrases = [
    {
      'id': 1,
      'source': 'Ma pede, nonummy ut, molestie\n\nMore stuff',
      'translation': 'dui quis accumsan',
      'status': 'translated',
      'classes': ['is-unfocused']
    },
    {
      'id': 2,
      'source': 'ac facilisis facilisis, magna tellus faucibus leo, in ' +
      'tellus justo sit amet nulla. Donec non justo. Proin non massa non ' +
      'bibendum ullamcorper.',
      'translation': '',
      'status': 'untranslated',
      'classes': ['is-focused']
    },
    {
      'id': 3,
      'source': 'quam vel sapien imperdiet ornare.',
      'translation': 'imperdiet',
      'status': 'fuzzy',
      'classes': ['is-unfocused']
    },
    {
      'id': 4,
      'source': 'nibh. Donec est mauris, rhoncus id, mollis nec, cursus a,' +
      '. Suspendisse aliquet, sem ut cursus luctus, ipsum',
      'translation': 'orci. Ut sagittis',
      'status': 'translated',
      'classes': ['is-unfocused']
    },
    {
      'id': 5,
      'source': 'non enim commodo hendrerit. Donec porttitor tellus' +
      'non magna. Nam ligula elit, pretium et, rutrum non, hendrerit' +
      'id, ante. Nunc mauris sapien, cursus in, hendrerit consectetuer,' +
      'cursus et, magna. Praesent interdum ligula eu enim. Etiam' +
      'imperdiet dictum magna. Ut tincidunt orci quis lectus. Nullam' +
      'suscipit, est ac facilisis facilisis, magna tellus faucibus leo,' +
      'in lobortis tellus justo sit amet nulla. Donec non justo. Proin' +
      'non massa non',
      'translation': 'vulputate',
      'status': 'translated',
      'classes': ['is-unfocused']
    },
    {
      'id': 6,
      'source': 'velit. Sed malesuada augue ut lacus. Nulla tincidunt,' +
      'neque vitae semper egestas, urna justo faucibus lectus, a' +
      'sollicitudin orci sem eget massa. Suspendisse eleifend. Cras sed leo.' +
      'Cras vehicula aliquet libero. Integer in magna. Phasellus dolor elit,' +
      'pellentesque a, facilisis non, bibendum sed, est. Nunc',
      'translation': 'orci, adipiscing non,',
      'status': 'translated',
      'classes': ['is-unfocused']
    },
    {
      'id': 7,
      'source': 'montes, nascetur ridiculus mus.',
      'translation': 'nisi dictum',
      'status': 'translated',
      'classes': ['is-unfocused']
    },
    {
      'id': 8,
      'source': 'dictum eu, placerat eget, venenatis a, magna. Lorem ipsum' +
      'dolor sit amet, consectetuer adipiscing elit. Etiam laoreet, libero' +
      'et tristique pellentesque, tellus sem mollis dui,',
      'translation': 'vel,',
      'status': 'translated',
      'classes': ['is-unfocused']
    },
    {
      'id': 9,
      'source': 'at pretium aliquet, metus',
      'translation': 'fames',
      'status': 'translated',
      'classes': ['is-unfocused']
    },
    {
      'id': 10,
      'source': 'lobortis tellus justo sit amet nulla. Donec non justo.' +
      'Proin non massa non ante bibendum ullamcorper. Duis cursus, diam at' +
      'pretium aliquet, metus urna convallis erat, eget tincidunt dui' +
      'augue',
      'translation': '',
      'status': 'untranslated',
      'classes': ['is-unfocused']
    },
    {
      'id': 11,
      'source': 'eu tempor erat neque non quam. Pellentesque habitant morbi' +
      'tristique senectus et netus et malesuada fames ac turpis egestas.' +
      'Aliquam fringilla cursus purus. Nullam scelerisque neque sed sem' +
      'egestas blandit. Nam nulla magna, malesuada vel, convallis in, cursus' +
      'et, eros. Proin ultrices. Duis volutpat nunc sit',
      'translation': '',
      'status': 'untranslated',
      'classes': ['is-unfocused']
    },
    {
      'id': 12,
      'source': 'ultrices sit amet, risus. Donec nibh enim, gravida sit' +
      'amet, dapibus id, blandit at, nisi. Cum sociis natoque penatibus et' +
      'magnis dis parturient montes, nascetur ridiculus mus. Proin vel nisl.' +
      'Quisque fringilla euismod enim. Etiam gravida molestie arcu. Sed eu' +
      'nibh vulputate mauris sagittis placerat. Cras dictum ultricies' +
      'ligula. Nullam enim. Sed nulla ante, iaculis nec, eleifend non,' +
      'dapibus rutrum, justo. Praesent luctus. Curabitur egestas nunc sed' +
      'libero. Proin sed turpis nec mauris blandit',
      'translation': 'risus. Nulla eget',
      'status': 'fuzzy',
      'classes': ['is-unfocused']
    },
    {
      'id': 13,
      'source': 'aliquam, enim nec tempus scelerisque, lorem ipsum sodales' +
      'purus, in molestie tortor nibh sit amet orci. Ut sagittis lobortis' +
      'mauris. Suspendisse aliquet molestie tellus. Aenean egestas hendrerit' +
      'neque. In ornare sagittis felis. Donec tempor, est ac mattis semper,' +
      'dui lectus rutrum urna, nec luctus felis purus ac tellus. Suspendisse' +
      'sed dolor. Fusce',
      'translation': 'Nunc sed orci',
      'status': 'fuzzy',
      'classes': ['is-unfocused']
    },
    {
      'id': 14,
      'source': 'tempor lorem, eget mollis lectus pede et risus. Quisque' +
      'libero lacus, varius et, euismod et, commodo at, libero. Morbi' +
      'accumsan laoreet ipsum. Curabitur consequat, lectus sit amet luctus' +
      'vulputate, nisi sem semper erat, in consectetuer ipsum nunc id enim.' +
      'Curabitur massa. Vestibulum accumsan neque et nunc. Quisque ornare',
      'translation': '',
      'status': 'untranslated',
      'classes': ['is-unfocused']
    },
    {
      'id': 15,
      'source': 'mauris. Morbi non sapien molestie orci tincidunt' +
      'adipiscing. Mauris molestie pharetra nibh. Aliquam ornare, libero at' +
      'auctor ullamcorper, nisl arcu iaculis enim, sit amet ornare lectus' +
      'justo eu arcu. Morbi sit amet massa. Quisque porttitor eros nec' +
      'tellus. Nunc lectus pede, ultrices',
      'translation': 'id',
      'status': 'fuzzy',
      'classes': ['is-unfocused']
    },
    {
      'id': 16,
      'source': 'amet, risus. Donec nibh enim, gravida sit amet, dapibus' +
      'id, blandit at, nisi. Cum sociis natoque penatibus et magnis dis' +
      'parturient montes, nascetur ridiculus mus. Proin vel nisl. Quisque' +
      'fringilla euismod enim. Etiam gravida molestie arcu. Sed eu nibh' +
      'vulputate mauris sagittis placerat. Cras dictum ultricies ligula.' +
      'Nullam enim. Sed nulla ante, iaculis nec,',
      'translation': 'Sed auctor odio',
      'status': 'translated',
      'classes': ['is-unfocused']
    },
    {
      'id': 17,
      'source': 'Nulla tempor augue ac ipsum. Phasellus vitae mauris sit' +
      'amet lorem semper auctor. Mauris vel turpis. Aliquam adipiscing',
      'translation': '',
      'status': 'untranslated',
      'classes': ['is-unfocused']
    },
    {
      'id': 18,
      'source': 'sapien imperdiet ornare. In faucibus. Morbi vehicula.' +
      'Pellentesque tincidunt tempus risus.',
      'translation': 'et',
      'status': 'fuzzy',
      'classes': ['is-unfocused']
    },
    {
      'id': 19,
      'source': 'ac metus vitae velit egestas lacinia. Sed congue, elit sed' +
      'consequat auctor, nunc nulla vulputate dui, nec tempus mauris erat' +
      'eget ipsum. Suspendisse sagittis. Nullam vitae diam. Proin dolor.' +
      'Nulla semper tellus id nunc interdum feugiat. Sed nec metus facilisis' +
      'lorem tristique aliquet. Phasellus fermentum convallis ligula. Donec' +
      'luctus aliquet odio. Etiam ligula tortor, dictum eu, placerat eget,' +
      'venenatis a, magna. Lorem ipsum dolor sit amet, consectetuer' +
      'adipiscing',
      'translation': '',
      'status': 'untranslated',
      'classes': ['is-unfocused']
    },
    {
      'id': 20,
      'source': 'eu dui. Cum sociis natoque penatibus et magnis dis' +
      'parturient montes, nascetur ridiculus mus. Aenean eget magna.' +
      'Suspendisse tristique neque venenatis lacus. Etiam bibendum fermentum' +
      'metus. Aenean sed pede nec',
      'translation': '',
      'status': 'untranslated',
      'classes': ['is-unfocused']
    },
    {
      'id': 21,
      'source': 'Ma pede, nonummy ut, molestie\n\nMore stuff',
      'translation': 'dui quis accumsan',
      'status': 'translated',
      'classes': ['is-unfocused']
    },
    {
      'id': 22,
      'source': 'ac facilisis facilisis, magna tellus faucibus leo, in ' +
      'tellus justo sit amet nulla. Donec non justo. Proin non massa non ' +
      'bibendum ullamcorper.',
      'translation': '',
      'status': 'untranslated',
      'classes': ['is-focused']
    },
    {
      'id': 23,
      'source': 'quam vel sapien imperdiet ornare.',
      'translation': 'imperdiet',
      'status': 'fuzzy',
      'classes': ['is-unfocused']
    },
    {
      'id': 24,
      'source': 'nibh. Donec est mauris, rhoncus id, mollis nec, cursus a, ' +
      '. Suspendisse aliquet, sem ut cursus luctus, ipsum',
      'translation': 'orci. Ut sagittis',
      'status': 'translated',
      'classes': ['is-unfocused']
    },
    {
      'id': 25,
      'source': 'non enim commodo hendrerit. Donec porttitor tellus' +
      'non magna. Nam ligula elit, pretium et, rutrum non, hendrerit' +
      'id, ante. Nunc mauris sapien, cursus in, hendrerit consectetuer,' +
      'cursus et, magna. Praesent interdum ligula eu enim. Etiam' +
      'imperdiet dictum magna. Ut tincidunt orci quis lectus. Nullam' +
      'suscipit, est ac facilisis facilisis, magna tellus faucibus leo,' +
      'in lobortis tellus justo sit amet nulla. Donec non justo. Proin' +
      'non massa non',
      'translation': 'vulputate',
      'status': 'translated',
      'classes': ['is-unfocused']
    },
    {
      'id': 26,
      'source': 'velit. Sed malesuada augue ut lacus. Nulla tincidunt,' +
      'neque vitae semper egestas, urna justo faucibus lectus, a' +
      'sollicitudin orci sem eget massa. Suspendisse eleifend. Cras sed leo.' +
      'Cras vehicula aliquet libero. Integer in magna. Phasellus dolor elit,' +
      'pellentesque a, facilisis non, bibendum sed, est. Nunc',
      'translation': 'orci, adipiscing non,',
      'status': 'translated',
      'classes': ['is-unfocused']
    },
    {
      'id': 27,
      'source': 'montes, nascetur ridiculus mus.',
      'translation': 'nisi dictum',
      'status': 'translated',
      'classes': ['is-unfocused']
    },
    {
      'id': 28,
      'source': 'dictum eu, placerat eget, venenatis a, magna. Lorem ipsum' +
      'dolor sit amet, consectetuer adipiscing elit. Etiam laoreet, libero' +
      'et tristique pellentesque, tellus sem mollis dui,',
      'translation': 'vel,',
      'status': 'translated',
      'classes': ['is-unfocused']
    },
    {
      'id': 29,
      'source': 'at pretium aliquet, metus',
      'translation': 'fames',
      'status': 'translated',
      'classes': ['is-unfocused']
    },
    {
      'id': 30,
      'source': 'lobortis tellus justo sit amet nulla. Donec non justo.' +
      'Proin non massa non ante bibendum ullamcorper. Duis cursus, diam at' +
      'pretium aliquet, metus urna convallis erat, eget tincidunt dui' +
      'augue',
      'translation': '',
      'status': 'untranslated',
      'classes': ['is-unfocused']
    },
    {
      'id': 31,
      'source': 'eu tempor erat neque non quam. Pellentesque habitant morbi' +
      'tristique senectus et netus et malesuada fames ac turpis egestas.' +
      'Aliquam fringilla cursus purus. Nullam scelerisque neque sed sem' +
      'egestas blandit. Nam nulla magna, malesuada vel, convallis in, cursus' +
      'et, eros. Proin ultrices. Duis volutpat nunc sit',
      'translation': '',
      'status': 'untranslated',
      'classes': ['is-unfocused']
    },
    {
      'id': 32,
      'source': 'ultrices sit amet, risus. Donec nibh enim, gravida sit' +
      'amet, dapibus id, blandit at, nisi. Cum sociis natoque penatibus et' +
      'magnis dis parturient montes, nascetur ridiculus mus. Proin vel nisl.' +
      'Quisque fringilla euismod enim. Etiam gravida molestie arcu. Sed eu' +
      'nibh vulputate mauris sagittis placerat. Cras dictum ultricies' +
      'ligula. Nullam enim. Sed nulla ante, iaculis nec, eleifend non,' +
      'dapibus rutrum, justo. Praesent luctus. Curabitur egestas nunc sed' +
      'libero. Proin sed turpis nec mauris blandit',
      'translation': 'risus. Nulla eget',
      'status': 'fuzzy',
      'classes': ['is-unfocused']
    },
    {
      'id': 33,
      'source': 'aliquam, enim nec tempus scelerisque, lorem ipsum sodales' +
      'purus, in molestie tortor nibh sit amet orci. Ut sagittis lobortis' +
      'mauris. Suspendisse aliquet molestie tellus. Aenean egestas hendrerit' +
      'neque. In ornare sagittis felis. Donec tempor, est ac mattis semper,' +
      'dui lectus rutrum urna, nec luctus felis purus ac tellus. Suspendisse' +
      'sed dolor. Fusce',
      'translation': 'Nunc sed orci',
      'status': 'fuzzy',
      'classes': ['is-unfocused']
    },
    {
      'id': 34,
      'source': 'tempor lorem, eget mollis lectus pede et risus. Quisque' +
      'libero lacus, varius et, euismod et, commodo at, libero. Morbi' +
      'accumsan laoreet ipsum. Curabitur consequat, lectus sit amet luctus' +
      'vulputate, nisi sem semper erat, in consectetuer ipsum nunc id enim.' +
      'Curabitur massa. Vestibulum accumsan neque et nunc. Quisque ornare',
      'translation': '',
      'status': 'untranslated',
      'classes': ['is-unfocused']
    },
    {
      'id': 35,
      'source': 'mauris. Morbi non sapien molestie orci tincidunt' +
      'adipiscing. Mauris molestie pharetra nibh. Aliquam ornare, libero at' +
      'auctor ullamcorper, nisl arcu iaculis enim, sit amet ornare lectus' +
      'justo eu arcu. Morbi sit amet massa. Quisque porttitor eros nec' +
      'tellus. Nunc lectus pede, ultrices',
      'translation': 'id',
      'status': 'fuzzy',
      'classes': ['is-unfocused']
    },
    {
      'id': 36,
      'source': 'amet, risus. Donec nibh enim, gravida sit amet, dapibus' +
      'id, blandit at, nisi. Cum sociis natoque penatibus et magnis dis' +
      'parturient montes, nascetur ridiculus mus. Proin vel nisl. Quisque' +
      'fringilla euismod enim. Etiam gravida molestie arcu. Sed eu nibh' +
      'vulputate mauris sagittis placerat. Cras dictum ultricies ligula.' +
      'Nullam enim. Sed nulla ante, iaculis nec,',
      'translation': 'Sed auctor odio',
      'status': 'translated',
      'classes': ['is-unfocused']
    },
    {
      'id': 37,
      'source': 'Nulla tempor augue ac ipsum. Phasellus vitae mauris sit' +
      'amet lorem semper auctor. Mauris vel turpis. Aliquam adipiscing',
      'translation': '',
      'status': 'untranslated',
      'classes': ['is-unfocused']
    },
    {
      'id': 38,
      'source': 'sapien imperdiet ornare. In faucibus. Morbi vehicula.' +
      'Pellentesque tincidunt tempus risus.',
      'translation': 'et',
      'status': 'fuzzy',
      'classes': ['is-unfocused']
    },
    {
      'id': 39,
      'source': 'ac metus vitae velit egestas lacinia. Sed congue, elit sed' +
      'consequat auctor, nunc nulla vulputate dui, nec tempus mauris erat' +
      'eget ipsum. Suspendisse sagittis. Nullam vitae diam. Proin dolor.' +
      'Nulla semper tellus id nunc interdum feugiat. Sed nec metus facilisis' +
      'lorem tristique aliquet. Phasellus fermentum convallis ligula. Donec' +
      'luctus aliquet odio. Etiam ligula tortor, dictum eu, placerat eget,' +
      'venenatis a, magna. Lorem ipsum dolor sit amet, consectetuer' +
      'adipiscing',
      'translation': '',
      'status': 'untranslated',
      'classes': ['is-unfocused']
    },
    {
      'id': 40,
      'source': 'eu dui. Cum sociis natoque penatibus et magnis dis' +
      'parturient montes, nascetur ridiculus mus. Aenean eget magna.' +
      'Suspendisse tristique neque venenatis lacus. Etiam bibendum fermentum' +
      'metus. Aenean sed pede nec',
      'translation': '',
      'status': 'untranslated',
      'classes': ['is-unfocused']
    },
    {
      'id': 41,
      'source': 'Ma pede, nonummy ut, molestie\n\nMore stuff',
      'translation': 'dui quis accumsan',
      'status': 'translated',
      'classes': ['is-unfocused']
    },
    {
      'id': 42,
      'source': 'ac facilisis facilisis, magna tellus faucibus leo, in ' +
      'tellus justo sit amet nulla. Donec non justo. Proin non massa non ' +
      'bibendum ullamcorper.',
      'translation': '',
      'status': 'untranslated',
      'classes': ['is-focused']
    },
    {
      'id': 43,
      'source': 'quam vel sapien imperdiet ornare.',
      'translation': 'imperdiet',
      'status': 'fuzzy',
      'classes': ['is-unfocused']
    },
    {
      'id': 44,
      'source': 'nibh. Donec est mauris, rhoncus id, mollis nec, cursus a, ' +
      '. Suspendisse aliquet, sem ut cursus luctus, ipsum',
      'translation': 'orci. Ut sagittis',
      'status': 'translated',
      'classes': ['is-unfocused']
    },
    {
      'id': 45,
      'source': 'non enim commodo hendrerit. Donec porttitor tellus' +
      'non magna. Nam ligula elit, pretium et, rutrum non, hendrerit' +
      'id, ante. Nunc mauris sapien, cursus in, hendrerit consectetuer,' +
      'cursus et, magna. Praesent interdum ligula eu enim. Etiam' +
      'imperdiet dictum magna. Ut tincidunt orci quis lectus. Nullam' +
      'suscipit, est ac facilisis facilisis, magna tellus faucibus leo,' +
      'in lobortis tellus justo sit amet nulla. Donec non justo. Proin' +
      'non massa non',
      'translation': 'vulputate',
      'status': 'translated',
      'classes': ['is-unfocused']
    },
    {
      'id': 46,
      'source': 'velit. Sed malesuada augue ut lacus. Nulla tincidunt,' +
      'neque vitae semper egestas, urna justo faucibus lectus, a' +
      'sollicitudin orci sem eget massa. Suspendisse eleifend. Cras sed leo.' +
      'Cras vehicula aliquet libero. Integer in magna. Phasellus dolor elit,' +
      'pellentesque a, facilisis non, bibendum sed, est. Nunc',
      'translation': 'orci, adipiscing non,',
      'status': 'translated',
      'classes': ['is-unfocused']
    },
    {
      'id': 47,
      'source': 'montes, nascetur ridiculus mus.',
      'translation': 'nisi dictum',
      'status': 'translated',
      'classes': ['is-unfocused']
    },
    {
      'id': 48,
      'source': 'dictum eu, placerat eget, venenatis a, magna. Lorem ipsum' +
      'dolor sit amet, consectetuer adipiscing elit. Etiam laoreet, libero' +
      'et tristique pellentesque, tellus sem mollis dui,',
      'translation': 'vel,',
      'status': 'translated',
      'classes': ['is-unfocused']
    },
    {
      'id': 49,
      'source': 'at pretium aliquet, metus',
      'translation': 'fames',
      'status': 'translated',
      'classes': ['is-unfocused']
    },
    {
      'id': 50,
      'source': 'lobortis tellus justo sit amet nulla. Donec non justo.' +
      'Proin non massa non ante bibendum ullamcorper. Duis cursus, diam at' +
      'pretium aliquet, metus urna convallis erat, eget tincidunt dui' +
      'augue',
      'translation': '',
      'status': 'untranslated',
      'classes': ['is-unfocused']
    },
    {
      'id': 51,
      'source': 'eu tempor erat neque non quam. Pellentesque habitant morbi' +
      'tristique senectus et netus et malesuada fames ac turpis egestas.' +
      'Aliquam fringilla cursus purus. Nullam scelerisque neque sed sem' +
      'egestas blandit. Nam nulla magna, malesuada vel, convallis in, cursus' +
      'et, eros. Proin ultrices. Duis volutpat nunc sit',
      'translation': '',
      'status': 'untranslated',
      'classes': ['is-unfocused']
    },
    {
      'id': 52,
      'source': 'ultrices sit amet, risus. Donec nibh enim, gravida sit' +
      'amet, dapibus id, blandit at, nisi. Cum sociis natoque penatibus et' +
      'magnis dis parturient montes, nascetur ridiculus mus. Proin vel nisl.' +
      'Quisque fringilla euismod enim. Etiam gravida molestie arcu. Sed eu' +
      'nibh vulputate mauris sagittis placerat. Cras dictum ultricies' +
      'ligula. Nullam enim. Sed nulla ante, iaculis nec, eleifend non,' +
      'dapibus rutrum, justo. Praesent luctus. Curabitur egestas nunc sed' +
      'libero. Proin sed turpis nec mauris blandit',
      'translation': 'risus. Nulla eget',
      'status': 'fuzzy',
      'classes': ['is-unfocused']
    },
    {
      'id': 53,
      'source': 'aliquam, enim nec tempus scelerisque, lorem ipsum sodales' +
      'purus, in molestie tortor nibh sit amet orci. Ut sagittis lobortis' +
      'mauris. Suspendisse aliquet molestie tellus. Aenean egestas hendrerit' +
      'neque. In ornare sagittis felis. Donec tempor, est ac mattis semper,' +
      'dui lectus rutrum urna, nec luctus felis purus ac tellus. Suspendisse' +
      'sed dolor. Fusce',
      'translation': 'Nunc sed orci',
      'status': 'fuzzy',
      'classes': ['is-unfocused']
    },
    {
      'id': 54,
      'source': 'tempor lorem, eget mollis lectus pede et risus. Quisque' +
      'libero lacus, varius et, euismod et, commodo at, libero. Morbi' +
      'accumsan laoreet ipsum. Curabitur consequat, lectus sit amet luctus' +
      'vulputate, nisi sem semper erat, in consectetuer ipsum nunc id enim.' +
      'Curabitur massa. Vestibulum accumsan neque et nunc. Quisque ornare',
      'translation': '',
      'status': 'untranslated',
      'classes': ['is-unfocused']
    },
    {
      'id': 55,
      'source': 'mauris. Morbi non sapien molestie orci tincidunt' +
      'adipiscing. Mauris molestie pharetra nibh. Aliquam ornare, libero at' +
      'auctor ullamcorper, nisl arcu iaculis enim, sit amet ornare lectus' +
      'justo eu arcu. Morbi sit amet massa. Quisque porttitor eros nec' +
      'tellus. Nunc lectus pede, ultrices',
      'translation': 'id',
      'status': 'fuzzy',
      'classes': ['is-unfocused']
    },
    {
      'id': 56,
      'source': 'amet, risus. Donec nibh enim, gravida sit amet, dapibus' +
      'id, blandit at, nisi. Cum sociis natoque penatibus et magnis dis' +
      'parturient montes, nascetur ridiculus mus. Proin vel nisl. Quisque' +
      'fringilla euismod enim. Etiam gravida molestie arcu. Sed eu nibh' +
      'vulputate mauris sagittis placerat. Cras dictum ultricies ligula.' +
      'Nullam enim. Sed nulla ante, iaculis nec,',
      'translation': 'Sed auctor odio',
      'status': 'translated',
      'classes': ['is-unfocused']
    },
    {
      'id': 57,
      'source': 'Nulla tempor augue ac ipsum. Phasellus vitae mauris sit' +
      'amet lorem semper auctor. Mauris vel turpis. Aliquam adipiscing',
      'translation': '',
      'status': 'untranslated',
      'classes': ['is-unfocused']
    },
    {
      'id': 58,
      'source': 'sapien imperdiet ornare. In faucibus. Morbi vehicula.' +
      'Pellentesque tincidunt tempus risus.',
      'translation': 'et',
      'status': 'fuzzy',
      'classes': ['is-unfocused']
    },
    {
      'id': 59,
      'source': 'ac metus vitae velit egestas lacinia. Sed congue, elit sed' +
      'consequat auctor, nunc nulla vulputate dui, nec tempus mauris erat' +
      'eget ipsum. Suspendisse sagittis. Nullam vitae diam. Proin dolor.' +
      'Nulla semper tellus id nunc interdum feugiat. Sed nec metus facilisis' +
      'lorem tristique aliquet. Phasellus fermentum convallis ligula. Donec' +
      'luctus aliquet odio. Etiam ligula tortor, dictum eu, placerat eget,' +
      'venenatis a, magna. Lorem ipsum dolor sit amet, consectetuer' +
      'adipiscing',
      'translation': '',
      'status': 'untranslated',
      'classes': ['is-unfocused']
    },
    {
      'id': 60,
      'source': 'eu dui. Cum sociis natoque penatibus et magnis dis' +
      'parturient montes, nascetur ridiculus mus. Aenean eget magna.' +
      'Suspendisse tristique neque venenatis lacus. Etiam bibendum fermentum' +
      'metus. Aenean sed pede nec',
      'translation': '',
      'status': 'untranslated',
      'classes': ['is-unfocused']
    },
    {
      'id': 61,
      'source': 'Ma pede, nonummy ut, molestie\n\nMore stuff',
      'translation': 'dui quis accumsan',
      'status': 'translated',
      'classes': ['is-unfocused']
    },
    {
      'id': 62,
      'source': 'ac facilisis facilisis, magna tellus faucibus leo, in ' +
      'tellus justo sit amet nulla. Donec non justo. Proin non massa non ' +
      'bibendum ullamcorper.',
      'translation': '',
      'status': 'untranslated',
      'classes': ['is-focused']
    },
    {
      'id': 63,
      'source': 'quam vel sapien imperdiet ornare.',
      'translation': 'imperdiet',
      'status': 'fuzzy',
      'classes': ['is-unfocused']
    },
    {
      'id': 64,
      'source': 'nibh. Donec est mauris, rhoncus id, mollis nec, cursus a, ' +
      '. Suspendisse aliquet, sem ut cursus luctus, ipsum',
      'translation': 'orci. Ut sagittis',
      'status': 'translated',
      'classes': ['is-unfocused']
    },
    {
      'id': 65,
      'source': 'non enim commodo hendrerit. Donec porttitor tellus' +
      'non magna. Nam ligula elit, pretium et, rutrum non, hendrerit' +
      'id, ante. Nunc mauris sapien, cursus in, hendrerit consectetuer,' +
      'cursus et, magna. Praesent interdum ligula eu enim. Etiam' +
      'imperdiet dictum magna. Ut tincidunt orci quis lectus. Nullam' +
      'suscipit, est ac facilisis facilisis, magna tellus faucibus leo,' +
      'in lobortis tellus justo sit amet nulla. Donec non justo. Proin' +
      'non massa non',
      'translation': 'vulputate',
      'status': 'translated',
      'classes': ['is-unfocused']
    },
    {
      'id': 66,
      'source': 'velit. Sed malesuada augue ut lacus. Nulla tincidunt,' +
      'neque vitae semper egestas, urna justo faucibus lectus, a' +
      'sollicitudin orci sem eget massa. Suspendisse eleifend. Cras sed leo.' +
      'Cras vehicula aliquet libero. Integer in magna. Phasellus dolor elit,' +
      'pellentesque a, facilisis non, bibendum sed, est. Nunc',
      'translation': 'orci, adipiscing non,',
      'status': 'translated',
      'classes': ['is-unfocused']
    },
    {
      'id': 67,
      'source': 'montes, nascetur ridiculus mus.',
      'translation': 'nisi dictum',
      'status': 'translated',
      'classes': ['is-unfocused']
    },
    {
      'id': 68,
      'source': 'dictum eu, placerat eget, venenatis a, magna. Lorem ipsum' +
      'dolor sit amet, consectetuer adipiscing elit. Etiam laoreet, libero' +
      'et tristique pellentesque, tellus sem mollis dui,',
      'translation': 'vel,',
      'status': 'translated',
      'classes': ['is-unfocused']
    },
    {
      'id': 69,
      'source': 'at pretium aliquet, metus',
      'translation': 'fames',
      'status': 'translated',
      'classes': ['is-unfocused']
    },
    {
      'id': 70,
      'source': 'lobortis tellus justo sit amet nulla. Donec non justo.' +
      'Proin non massa non ante bibendum ullamcorper. Duis cursus, diam at' +
      'pretium aliquet, metus urna convallis erat, eget tincidunt dui' +
      'augue',
      'translation': '',
      'status': 'untranslated',
      'classes': ['is-unfocused']
    },
    {
      'id': 71,
      'source': 'eu tempor erat neque non quam. Pellentesque habitant morbi' +
      'tristique senectus et netus et malesuada fames ac turpis egestas.' +
      'Aliquam fringilla cursus purus. Nullam scelerisque neque sed sem' +
      'egestas blandit. Nam nulla magna, malesuada vel, convallis in, cursus' +
      'et, eros. Proin ultrices. Duis volutpat nunc sit',
      'translation': '',
      'status': 'untranslated',
      'classes': ['is-unfocused']
    },
    {
      'id': 72,
      'source': 'ultrices sit amet, risus. Donec nibh enim, gravida sit' +
      'amet, dapibus id, blandit at, nisi. Cum sociis natoque penatibus et' +
      'magnis dis parturient montes, nascetur ridiculus mus. Proin vel nisl.' +
      'Quisque fringilla euismod enim. Etiam gravida molestie arcu. Sed eu' +
      'nibh vulputate mauris sagittis placerat. Cras dictum ultricies' +
      'ligula. Nullam enim. Sed nulla ante, iaculis nec, eleifend non,' +
      'dapibus rutrum, justo. Praesent luctus. Curabitur egestas nunc sed' +
      'libero. Proin sed turpis nec mauris blandit',
      'translation': 'risus. Nulla eget',
      'status': 'fuzzy',
      'classes': ['is-unfocused']
    },
    {
      'id': 73,
      'source': 'aliquam, enim nec tempus scelerisque, lorem ipsum sodales' +
      'purus, in molestie tortor nibh sit amet orci. Ut sagittis lobortis' +
      'mauris. Suspendisse aliquet molestie tellus. Aenean egestas hendrerit' +
      'neque. In ornare sagittis felis. Donec tempor, est ac mattis semper,' +
      'dui lectus rutrum urna, nec luctus felis purus ac tellus. Suspendisse' +
      'sed dolor. Fusce',
      'translation': 'Nunc sed orci',
      'status': 'fuzzy',
      'classes': ['is-unfocused']
    },
    {
      'id': 74,
      'source': 'tempor lorem, eget mollis lectus pede et risus. Quisque' +
      'libero lacus, varius et, euismod et, commodo at, libero. Morbi' +
      'accumsan laoreet ipsum. Curabitur consequat, lectus sit amet luctus' +
      'vulputate, nisi sem semper erat, in consectetuer ipsum nunc id enim.' +
      'Curabitur massa. Vestibulum accumsan neque et nunc. Quisque ornare',
      'translation': '',
      'status': 'untranslated',
      'classes': ['is-unfocused']
    },
    {
      'id': 75,
      'source': 'mauris. Morbi non sapien molestie orci tincidunt' +
      'adipiscing. Mauris molestie pharetra nibh. Aliquam ornare, libero at' +
      'auctor ullamcorper, nisl arcu iaculis enim, sit amet ornare lectus' +
      'justo eu arcu. Morbi sit amet massa. Quisque porttitor eros nec' +
      'tellus. Nunc lectus pede, ultrices',
      'translation': 'id',
      'status': 'fuzzy',
      'classes': ['is-unfocused']
    },
    {
      'id': 76,
      'source': 'amet, risus. Donec nibh enim, gravida sit amet, dapibus' +
      'id, blandit at, nisi. Cum sociis natoque penatibus et magnis dis' +
      'parturient montes, nascetur ridiculus mus. Proin vel nisl. Quisque' +
      'fringilla euismod enim. Etiam gravida molestie arcu. Sed eu nibh' +
      'vulputate mauris sagittis placerat. Cras dictum ultricies ligula.' +
      'Nullam enim. Sed nulla ante, iaculis nec,',
      'translation': 'Sed auctor odio',
      'status': 'translated',
      'classes': ['is-unfocused']
    },
    {
      'id': 77,
      'source': 'Nulla tempor augue ac ipsum. Phasellus vitae mauris sit' +
      'amet lorem semper auctor. Mauris vel turpis. Aliquam adipiscing',
      'translation': '',
      'status': 'untranslated',
      'classes': ['is-unfocused']
    },
    {
      'id': 78,
      'source': 'sapien imperdiet ornare. In faucibus. Morbi vehicula.' +
      'Pellentesque tincidunt tempus risus.',
      'translation': 'et',
      'status': 'fuzzy',
      'classes': ['is-unfocused']
    },
    {
      'id': 79,
      'source': 'ac metus vitae velit egestas lacinia. Sed congue, elit sed' +
      'consequat auctor, nunc nulla vulputate dui, nec tempus mauris erat' +
      'eget ipsum. Suspendisse sagittis. Nullam vitae diam. Proin dolor.' +
      'Nulla semper tellus id nunc interdum feugiat. Sed nec metus facilisis' +
      'lorem tristique aliquet. Phasellus fermentum convallis ligula. Donec' +
      'luctus aliquet odio. Etiam ligula tortor, dictum eu, placerat eget,' +
      'venenatis a, magna. Lorem ipsum dolor sit amet, consectetuer' +
      'adipiscing',
      'translation': '',
      'status': 'untranslated',
      'classes': ['is-unfocused']
    },
    {
      'id': 80,
      'source': 'eu dui. Cum sociis natoque penatibus et magnis dis' +
      'parturient montes, nascetur ridiculus mus. Aenean eget magna.' +
      'Suspendisse tristique neque venenatis lacus. Etiam bibendum fermentum' +
      'metus. Aenean sed pede nec',
      'translation': '',
      'status': 'untranslated',
      'classes': ['is-unfocused']
    },
    {
      'id': 81,
      'source': 'Ma pede, nonummy ut, molestie\n\nMore stuff',
      'translation': 'dui quis accumsan',
      'status': 'translated',
      'classes': ['is-unfocused']
    },
    {
      'id': 82,
      'source': 'ac facilisis facilisis, magna tellus faucibus leo, in ' +
      'tellus justo sit amet nulla. Donec non justo. Proin non massa non ' +
      'bibendum ullamcorper.',
      'translation': '',
      'status': 'untranslated',
      'classes': ['is-focused']
    },
    {
      'id': 83,
      'source': 'quam vel sapien imperdiet ornare.',
      'translation': 'imperdiet',
      'status': 'fuzzy',
      'classes': ['is-unfocused']
    },
    {
      'id': 84,
      'source': 'nibh. Donec est mauris, rhoncus id, mollis nec, cursus a, ' +
      '. Suspendisse aliquet, sem ut cursus luctus, ipsum',
      'translation': 'orci. Ut sagittis',
      'status': 'translated',
      'classes': ['is-unfocused']
    },
    {
      'id': 85,
      'source': 'non enim commodo hendrerit. Donec porttitor tellus' +
      'non magna. Nam ligula elit, pretium et, rutrum non, hendrerit' +
      'id, ante. Nunc mauris sapien, cursus in, hendrerit consectetuer,' +
      'cursus et, magna. Praesent interdum ligula eu enim. Etiam' +
      'imperdiet dictum magna. Ut tincidunt orci quis lectus. Nullam' +
      'suscipit, est ac facilisis facilisis, magna tellus faucibus leo,' +
      'in lobortis tellus justo sit amet nulla. Donec non justo. Proin' +
      'non massa non',
      'translation': 'vulputate',
      'status': 'translated',
      'classes': ['is-unfocused']
    },
    {
      'id': 86,
      'source': 'velit. Sed malesuada augue ut lacus. Nulla tincidunt,' +
      'neque vitae semper egestas, urna justo faucibus lectus, a' +
      'sollicitudin orci sem eget massa. Suspendisse eleifend. Cras sed leo.' +
      'Cras vehicula aliquet libero. Integer in magna. Phasellus dolor elit,' +
      'pellentesque a, facilisis non, bibendum sed, est. Nunc',
      'translation': 'orci, adipiscing non,',
      'status': 'translated',
      'classes': ['is-unfocused']
    },
    {
      'id': 87,
      'source': 'montes, nascetur ridiculus mus.',
      'translation': 'nisi dictum',
      'status': 'translated',
      'classes': ['is-unfocused']
    },
    {
      'id': 88,
      'source': 'dictum eu, placerat eget, venenatis a, magna. Lorem ipsum' +
      'dolor sit amet, consectetuer adipiscing elit. Etiam laoreet, libero' +
      'et tristique pellentesque, tellus sem mollis dui,',
      'translation': 'vel,',
      'status': 'translated',
      'classes': ['is-unfocused']
    },
    {
      'id': 89,
      'source': 'at pretium aliquet, metus',
      'translation': 'fames',
      'status': 'translated',
      'classes': ['is-unfocused']
    },
    {
      'id': 90,
      'source': 'lobortis tellus justo sit amet nulla. Donec non justo.' +
      'Proin non massa non ante bibendum ullamcorper. Duis cursus, diam at' +
      'pretium aliquet, metus urna convallis erat, eget tincidunt dui' +
      'augue',
      'translation': '',
      'status': 'untranslated',
      'classes': ['is-unfocused']
    },
    {
      'id': 91,
      'source': 'eu tempor erat neque non quam. Pellentesque habitant morbi' +
      'tristique senectus et netus et malesuada fames ac turpis egestas.' +
      'Aliquam fringilla cursus purus. Nullam scelerisque neque sed sem' +
      'egestas blandit. Nam nulla magna, malesuada vel, convallis in, cursus' +
      'et, eros. Proin ultrices. Duis volutpat nunc sit',
      'translation': '',
      'status': 'untranslated',
      'classes': ['is-unfocused']
    },
    {
      'id': 92,
      'source': 'ultrices sit amet, risus. Donec nibh enim, gravida sit' +
      'amet, dapibus id, blandit at, nisi. Cum sociis natoque penatibus et' +
      'magnis dis parturient montes, nascetur ridiculus mus. Proin vel nisl.' +
      'Quisque fringilla euismod enim. Etiam gravida molestie arcu. Sed eu' +
      'nibh vulputate mauris sagittis placerat. Cras dictum ultricies' +
      'ligula. Nullam enim. Sed nulla ante, iaculis nec, eleifend non,' +
      'dapibus rutrum, justo. Praesent luctus. Curabitur egestas nunc sed' +
      'libero. Proin sed turpis nec mauris blandit',
      'translation': 'risus. Nulla eget',
      'status': 'fuzzy',
      'classes': ['is-unfocused']
    },
    {
      'id': 93,
      'source': 'aliquam, enim nec tempus scelerisque, lorem ipsum sodales' +
      'purus, in molestie tortor nibh sit amet orci. Ut sagittis lobortis' +
      'mauris. Suspendisse aliquet molestie tellus. Aenean egestas hendrerit' +
      'neque. In ornare sagittis felis. Donec tempor, est ac mattis semper,' +
      'dui lectus rutrum urna, nec luctus felis purus ac tellus. Suspendisse' +
      'sed dolor. Fusce',
      'translation': 'Nunc sed orci',
      'status': 'fuzzy',
      'classes': ['is-unfocused']
    },
    {
      'id': 94,
      'source': 'tempor lorem, eget mollis lectus pede et risus. Quisque' +
      'libero lacus, varius et, euismod et, commodo at, libero. Morbi' +
      'accumsan laoreet ipsum. Curabitur consequat, lectus sit amet luctus' +
      'vulputate, nisi sem semper erat, in consectetuer ipsum nunc id enim.' +
      'Curabitur massa. Vestibulum accumsan neque et nunc. Quisque ornare',
      'translation': '',
      'status': 'untranslated',
      'classes': ['is-unfocused']
    },
    {
      'id': 95,
      'source': 'mauris. Morbi non sapien molestie orci tincidunt' +
      'adipiscing. Mauris molestie pharetra nibh. Aliquam ornare, libero at' +
      'auctor ullamcorper, nisl arcu iaculis enim, sit amet ornare lectus' +
      'justo eu arcu. Morbi sit amet massa. Quisque porttitor eros nec' +
      'tellus. Nunc lectus pede, ultrices',
      'translation': 'id',
      'status': 'fuzzy',
      'classes': ['is-unfocused']
    },
    {
      'id': 96,
      'source': 'amet, risus. Donec nibh enim, gravida sit amet, dapibus' +
      'id, blandit at, nisi. Cum sociis natoque penatibus et magnis dis' +
      'parturient montes, nascetur ridiculus mus. Proin vel nisl. Quisque' +
      'fringilla euismod enim. Etiam gravida molestie arcu. Sed eu nibh' +
      'vulputate mauris sagittis placerat. Cras dictum ultricies ligula.' +
      'Nullam enim. Sed nulla ante, iaculis nec,',
      'translation': 'Sed auctor odio',
      'status': 'translated',
      'classes': ['is-unfocused']
    },
    {
      'id': 97,
      'source': 'Nulla tempor augue ac ipsum. Phasellus vitae mauris sit' +
      'amet lorem semper auctor. Mauris vel turpis. Aliquam adipiscing',
      'translation': '',
      'status': 'untranslated',
      'classes': ['is-unfocused']
    },
    {
      'id': 98,
      'source': 'sapien imperdiet ornare. In faucibus. Morbi vehicula.' +
      'Pellentesque tincidunt tempus risus.',
      'translation': 'et',
      'status': 'fuzzy',
      'classes': ['is-unfocused']
    },
    {
      'id': 99,
      'source': 'ac metus vitae velit egestas lacinia. Sed congue, elit sed' +
      'consequat auctor, nunc nulla vulputate dui, nec tempus mauris erat' +
      'eget ipsum. Suspendisse sagittis. Nullam vitae diam. Proin dolor.' +
      'Nulla semper tellus id nunc interdum feugiat. Sed nec metus facilisis' +
      'lorem tristique aliquet. Phasellus fermentum convallis ligula. Donec' +
      'luctus aliquet odio. Etiam ligula tortor, dictum eu, placerat eget,' +
      'venenatis a, magna. Lorem ipsum dolor sit amet, consectetuer' +
      'adipiscing',
      'translation': '',
      'status': 'untranslated',
      'classes': ['is-unfocused']
    },
    {
      'id': 100,
      'source': 'eu dui. Cum sociis natoque penatibus et magnis dis' +
      'parturient montes, nascetur ridiculus mus. Aenean eget magna.' +
      'Suspendisse tristique neque venenatis lacus. Etiam bibendum fermentum' +
      'metus. Aenean sed pede nec',
      'translation': '',
      'status': 'untranslated',
      'classes': ['is-unfocused']
    },
  ];

  // We use promises to make this api asynchronous. This is clearly not
  // necessary when using in-memory data but it makes this service more flexible
  // and plug-and-play. For example, you can now easily replace this service
  // with a JSON service that gets its data from a remote server without having
  // to changes anything in the modules invoking the data service since the api
  // is already async.

  phraseService.findAll = function(limit) {
    var deferred = $q.defer();

    if (limit) {
      phrases = $filter('limitTo')(phrases, limit);
    }

    deferred.resolve(phrases);
    return deferred.promise;
  };

  phraseService.findById = function(phraseId) {
    var deferred = $q.defer();
    var phrase = phrases[phraseId];
    deferred.resolve(phrase);
    return deferred.promise;
  };

  return phraseService;
}

angular
  .module('app')
  .factory('PhraseService', PhraseService);

})();
