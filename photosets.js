/*

photosets fix by annasthms
made nov 8, 2018

*/
function create(type, id = '', classname = '', text = '') {
    let temp = document.createElement(type);
    if (id != '') temp.id = id;
    if (classname != '') temp.className = classname;
    if (text != '') temp.innerText = text;
    return temp;
  }
  
  function hasClass(elem, c) {
    if (elem) {
      let classes = elem.className.split(' ');
      if (classes.includes(c)) return true;
      return false;
    }
    return false;
  }
  
  function addClass(elem, c) {
    if (elem) {
      let classes = elem.className.split(' ');
      if (!classes.includes(c)) classes.push(c);
      elem.className = classes.join(' ');
    }
  }
  
  function removeClass(elem, c) {
    if (elem) {
      let classes = elem.className.split(' ');
      if (classes.includes(c)) classes.splice(classes.indexOf(c), 1);
      elem.className = classes.join(' ');
    }
  }
  
  function findLayouts(elem) {
    let layouts = [];
    let photos = elem.querySelectorAll('figure.tmblr-full');
    let photoCount = photos.length;
    let currentPhotoCount = 0;
    let rows = elem.querySelectorAll('.npf_row');
    let rowCount = rows.legnth;
    let currentRowCount = 0;
    let layout = '',
      count = 0;
    for (let i = 0; i < photoCount; i++) {
      let cur = photos[i];
      if (hasClass(cur.parentNode, 'npf_row')) {
        count++;
        if (!hasClass(cur.nextElementSibling, 'tmblr-full')) {
          layout += count.toString();
          count = 0;
          if (!(hasClass(cur.parentNode.nextElementSibling, 'tmblr-full') || hasClass(cur.parentNode.nextElementSibling, 'npf_row'))) {
            layouts.push(layout);
            layout = '';
            continue;
          }
        }
      } else {
        count = 1;
        layout += count.toString();
        count = 0;
        if (!(hasClass(cur.nextElementSibling, 'tmblr-full') || hasClass(cur.nextElementSibling, 'npf_row'))) {
          layouts.push(layout);
          layout = '';
          continue;
        }
      }
    }
    return layouts;
  }
  
  function layoutPhotos(elem, layouts, tc, pc) {
    let layout = layouts[0];
    let totalPhotos = (function () {
      let temp = 0;
      for (let i = 0; i < layout.length; i++) temp += parseInt(layout[i]);
      return temp;
    })();
    if (totalPhotos > 1) {
      let container = create('div', '', 'photoset-grid');
      container.setAttribute('photoset-layout', layout);
      elem.insertAdjacentElement('afterbegin', container);
      for (let i = 0; i < totalPhotos; i++) {
        let curFigure = elem.getElementsByClassName('tmblr-full')[i];
        let curPhoto = curFigure.getElementsByTagName('img')[0];
        let cont = create('div');
        container.appendChild(cont);
        cont.setAttribute('data-width', curFigure.getAttribute('data-orig-width'));
        cont.setAttribute('data-height', curFigure.getAttribute('data-orig-height'));
        highres = curPhoto.src;
        if (curPhoto.src.includes('_')) {
          let highres = curPhoto.src.split('_');
          highres[2] = highres[2].split('.');
          highres[2][0] = '1280';
          highres[2] = highres[2].join('.');
          highres = highres.join('_');
        }
        cont.setAttribute('data-highres', highres);
        cont.setAttribute('data-lowres', curPhoto.src);
        cont.setAttribute('onclick', 'lightbox(this)');
        cont.appendChild(curPhoto);
      }
      for (let i = totalPhotos - 1; i >= 0; i--) {
        let curFigure = elem.getElementsByClassName('tmblr-full')[i];
        curFigure.parentNode.removeChild(curFigure);
      }
      let npfRow = (function () {
        let rows = elem.querySelectorAll('.npf_row');
        let newRows = [];
        for (let i = 0; i < rows.length; i++) {
          if (rows[i].children.length == 0) newRows.push(rows[i]);
        }
        return newRows;
      })();
      for (let i = npfRow.length - 1; i >= 0; i--) {
        npfRow[i].parentNode.removeChild(npfRow[i]);
      }
      removeClass(elem, tc);
      addClass(elem, pc);
    }
  }
  
  function layoutPhotosPxu(elem, id, layouts, tc, pc) {
    let layout = layouts[0];
    let totalPhotos = (function () {
      let temp = 0;
      for (let i = 0; i < layout.length; i++) temp += parseInt(layout[i]);
      return temp;
    })();
    if (totalPhotos > 1) {
      let container = create('div', 'photoset_' + id, 'photo-slideshow');
      container.setAttribute('data-layout', layout);
      elem.insertAdjacentElement('afterbegin', container);
      for (let i = 0; i < totalPhotos; i++) {
        let curFigure = elem.getElementsByClassName('tmblr-full')[i];
        let curPhoto = curFigure.getElementsByTagName('img')[0];
        let photoData = create('div', '', 'photo-data');
        container.appendChild(photoData);
        let pxuPhoto = create('div', '', 'pxu-photo');
        photoData.appendChild(pxuPhoto);
        curPhoto.setAttribute('data-width', curFigure.getAttribute('data-orig-width'));
        curPhoto.setAttribute('data-height', curFigure.getAttribute('data-orig-height'));
        highres = curPhoto.src;
        if (curPhoto.src.includes('_')) {
          let highres = curPhoto.src.split('_');
          highres[2] = highres[2].split('.');
          highres[2][0] = '1280';
          highres[2] = highres[2].join('.');
          highres = highres.join('_');
        }
        curPhoto.setAttribute('data-highres', highres);
        curPhoto.setAttribute('data-lowres', curPhoto.src);
        curPhoto.setAttribute('onclick', 'lightbox(this)');
        pxuPhoto.appendChild(curPhoto);
        let tumblrBox = create('a', '', 'tumblr-box');
        photoData.appendChild(tumblrBox);
        tumblrBox.rel = 'post-' + id;
        tumblrBox.href = curPhoto.src;
      }
      for (let i = totalPhotos - 1; i >= 0; i--) {
        let curFigure = elem.getElementsByClassName('tmblr-full')[i];
        curFigure.parentNode.removeChild(curFigure);
      }
      let npfRow = (function () {
        let rows = elem.querySelectorAll('.npf_row');
        let newRows = [];
        for (let i = 0; i < rows.length; i++) {
          if (rows[i].children.length == 0) newRows.push(rows[i]);
        }
        return newRows;
      })();
      for (let i = npfRow.length - 1; i >= 0; i--) {
        npfRow[i].parentNode.removeChild(npfRow[i]);
      }
      removeClass(elem, tc);
      addClass(elem, pc);
    }
  }
  
  function undoPhotoset(options = {
    'posts': '.post.text',
    'text class': 'text',
    'photoset class': 'photo'
  }, pxu = false) {
    const posts = document.querySelectorAll(options.posts);
    for (let p = 0; p < posts.length; p++) {
      let curPost = posts[p];
      if (curPost.getElementsByClassName('tmblr-full').length) {
        let layouts = findLayouts(curPost);
        if (pxu) layoutPhotosPxu(curPost, curPost.id, layouts, options['text class'], options['photoset class']);
        else layoutPhotos(curPost, layouts, options['text class'], options['photoset class']);
      }
    }
  }