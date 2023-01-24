// C:\DATA\dev_2020\CODEBASE\tnt_code\_front\asimple\js

//#region classes (trash.js)
class ADecisionGenTrash {
  onSelectedUnit(ev) {
    if (!this.selectionDone) {
      let idUnit = evToId(ev);
      for (const t of this.tuples) {
        if (t.includes(this.msSelected.id) && t.includes(idUnit)) {
          this.selectionDone = true;
          this.clearHighlighting();
          this.tuple = t;
          this.highlightTuple(t);
          this.callback(t);
        }
      }
    }
  }
  filterTuples(id) {
    unitTestFilter('filterTuples', id);
    let d = document.getElementById('divSelect');
    let elTuples = arrChildren(d);
    for (let i = 0; i < this.tuples.length; i++) {
      const t = this.tuples[i];
      const el = elTuples[i];
      if (!t.includes(id)) {
        el.style = 'display:none';
      } else {
        unitTestFilter('found match!', t.toString());
        for (const s of t) {
          if (s == id) continue;
          this.highlightObject(s);
        }
      }
    }
  }
}
//#endregion classes
