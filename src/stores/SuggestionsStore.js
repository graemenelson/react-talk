import Rx from 'rx'
import EventEmitter from 'events'
import {extendReactive} from 'mobservable'
import jsonp from 'jsonp-promise'

const url = "https://api.github.com/users"
const eventEmitter = new EventEmitter()

export default class SuggestionsStore {
  constructor(numberToDisplay) {
    extendReactive(this, {
      active: []
    })
    this.suggestions     = []
    this.numberToDisplay = numberToDisplay || 3

    this._createLoadMoreSubscription()
  }
  refreshAll() {
    this._assignToActive()
    eventEmitter.emit('loadMore')
  }
  refresh(entry) {
    Rx.Observable.from(this.active)
                 .map(this._replaceEntry.bind(this, entry))
                 .toArray()
                 .subscribe((results) => {this.active = results})

    eventEmitter.emit('loadMore')
  }
  hasSuggestions() {
    return this.active.length > 0;
  }

  _assignToActive() {
    this._suggestionsStream()
        .take(this.numberToDisplay)
        .toArray()
        .subscribe(this._updateActiveAndSuggestions.bind(this))
  }


  _suggestionsStream() {
    return Rx.Observable.from(this.suggestions)
  }

  _createLoadMoreSubscription() {
    Rx.Observable.fromEvent(eventEmitter, 'loadMore')
                 .startWith('loadMore')
                 .throttle(250 /** 250 ms, so don't do multiple requests **/)
                 .map(this._loadMoreRequestStream.bind(this))
                 .flatMap(this._loadMoreResponseStream.bind(this))
                 .subscribe(this._loadMoreFromRemote.bind(this))

  }
  _needToLoadMore() {
    return this.suggestions.length < this.numberToDisplay*2
  }
  _loadMoreRequestStream() {
    let randomOffset = Math.floor(Math.random()*500)
    return `${url}?since=${randomOffset}`
  }
  _loadMoreResponseStream(url) {
    return this._needToLoadMore() ?
            Rx.Observable.fromPromise(jsonp(url).promise) :
            Rx.Observable.fromPromise(Promise.resolve([]))
  }
  _loadMoreFromRemote(results) {
    this.suggestions = this.suggestions.concat(results.data)

    if(!this.hasSuggestions()) {
      this._assignToActive()
    }
  }


  _updateActiveAndSuggestions(results) {
    this.active = results

    this._suggestionsStream()
        .filter(this._filterActive.bind(this))
        .toArray()
        .subscribe((results) => {this.suggestions = results})
  }
  _filterActive(entry) {
    return entry && this.active.map((x) => {return x.id}).indexOf(entry.id) < 0
  }

  _replaceEntry(replaceEntry, currentEntry) {
    return replaceEntry === currentEntry ?
            this.suggestions.shift() :
            currentEntry
  }

}
