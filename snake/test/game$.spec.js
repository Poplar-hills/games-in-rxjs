import test from 'ava'
import {TestScheduler} from 'rxjs/testing/TestScheduler'
import {genGame$} from '../src/actors'

const testData = [
  {
    desc: 'should emit values when the game is running normally',
    snake:      '--a--b--c--',
    food:       'f----------',
    scoreboard: 's----------',
    expected:   '--i--j--k--',
    snakeValues: {
      a: [{x: 1, y: 1, color: ''}],
      b: [{x: 2, y: 1, color: ''}],
      c: [{x: 3, y: 1, color: ''}]
    },
    foodValues: {f: {x: 0, y: 0, color: ''}},
    scoreboardValues: {s: 5},
    expectedValues: {
      i: {
        snake: [{x: 1, y: 1, color: ''}],
        food: {x: 0, y: 0, color: ''},
        scoreboard: 5,
        isGameOver: false
      },
      j: {
        snake: [{x: 2, y: 1, color: ''}],
        food: {x: 0, y: 0, color: ''},
        scoreboard: 5,
        isGameOver: false
      },
      k: {
        snake: [{x: 3, y: 1, color: ''}],
        food: {x: 0, y: 0, color: ''},
        scoreboard: 5,
        isGameOver: false
      }
    }
  },
  {
    desc: 'should emit a value that can signify the end of the game when there is no more food',
    snake:      '--a--b--c--',
    food:       'f----g-----',
    scoreboard: 's----------',
    expected:   '--i--j--|',
    snakeValues: {
      a: [{x: 1, y: 1, color: ''}],
      b: [{x: 2, y: 1, color: ''}],
      c: [{x: 3, y: 1, color: ''}]
    },
    foodValues: {
      f: {x: 0, y: 0, color: ''},
      g: null
    },
    scoreboardValues: {s: 5},
    expectedValues: {
      i: {
        snake: [{x: 1, y: 1, color: ''}],
        food: {x: 0, y: 0, color: ''},
        scoreboard: 5,
        isGameOver: false
      },
      j: {
        snake: [{x: 2, y: 1, color: ''}],
        food: {x: 0, y: 0, color: ''},
        scoreboard: 5,
        isGameOver: false
      }
    }
  },
  {
    desc: 'should emit a value that can signify the end of the game when the snake bite on itself',
    snake:      '--a--b---',
    food:       'f--------',
    scoreboard: 's--------',
    expected:   '--i--|',
    snakeValues: {
      a: [
        {x: 0, y: 1, color: ''},
        {x: 1, y: 1, color: ''},
        {x: 1, y: 2, color: ''},
        {x: 2, y: 2, color: ''},
        {x: 1, y: 2, color: ''}
      ],
      b: [
        {x: 1, y: 1, color: ''},
        {x: 2, y: 1, color: ''},
        {x: 2, y: 2, color: ''},
        {x: 1, y: 2, color: ''},
        {x: 1, y: 1, color: ''}
      ]
    },
    foodValues: {f: {x: 0, y: 0, color: ''}},
    scoreboardValues: {s: 5},
    expectedValues: {
      i: {
        snake: [
          {x: 0, y: 1, color: ''},
          {x: 1, y: 1, color: ''},
          {x: 1, y: 2, color: ''},
          {x: 2, y: 2, color: ''},
          {x: 1, y: 2, color: ''}
        ],
        food: {x: 0, y: 0, color: ''},
        scoreboard: 5,
        isGameOver: false
      }
    }
  }
]

testData.forEach(_ => {
  test(_.desc, t => {
    const scheduler = new TestScheduler(t.deepEqual.bind(t))
    const snake$ = scheduler.createHotObservable(_.snake, _.snakeValues)
    const food$ = scheduler.createHotObservable(_.food, _.foodValues)
    const scoreboard$ = scheduler.createHotObservable(_.scoreboard, _.scoreboardValues)
    const game$ = genGame$(snake$, food$, scoreboard$)
    scheduler.expectObservable(game$).toBe(_.expected, _.expectedValues)
    scheduler.flush()
  })  
})
