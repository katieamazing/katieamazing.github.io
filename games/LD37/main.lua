--KonMatchThree
local tween = require "tween"

-- parameters
ROWS = 8
COLS = 7
SIZE = 64 -- pixels (both width and height)
SOURCE_SIZE = 65
GRAVITY = 0.1
MAX_DETERMINATION = 6
PIXELS_PER_SCORE = 10 -- TODO: mess with this

-- computed parameters
NUDGE_X = (love.graphics.getWidth() - COLS * SIZE) / 2 - SIZE / 2
NUDGE_Y = (love.graphics.getHeight() - ROWS * SIZE) / 2 - SIZE / 2 + 32
PIXELS_PER_DETERMINATION = (715 - 203) / MAX_DETERMINATION
CENTER_X = (love.graphics.getWidth()) / 2
CENTER_Y = (love.graphics.getHeight()) / 2
TEXT_Y = 200

local juicy_text = { x = CENTER_X, y = TEXT_Y, width = 8, height = 4 }
local instructions = { x = CENTER_X, y = CENTER_Y, width = 40, height = 40 }
jt_frame = 0
jt_category = nil
instructions_frames = 200

-- this is a list of all the categories
categories = {}
categories.books = { count = 0}
categories.cats = { count = 0 }
categories.laundry = { count = 0 }
categories.dishes = { count = 0 }
categories.flowers = { count = 0 }
categories.fruits = { count = 0 }
-- this is a list of all the kinds
kinds = {}
kinds.blue_book = {
  category = 'books',
  draw_at = function (x, y)
    x = x - SIZE / 2
    y = y - SIZE / 2
    love.graphics.draw(spritesheet, blue_book, x, y, 0, SIZE / SOURCE_SIZE, SIZE / SOURCE_SIZE)
  end
}
kinds.green_book = {
  category = 'books',
  draw_at = function (x, y)
    x = x - SIZE / 2
    y = y - SIZE / 2
    love.graphics.draw(spritesheet, green_book, x, y, 0, SIZE / SOURCE_SIZE, SIZE / SOURCE_SIZE)
  end
}
kinds.brown_book = {
  category = 'books',
  draw_at = function (x, y)
    x = x - SIZE / 2
    y = y - SIZE / 2
    love.graphics.draw(spritesheet, brown_book, x, y, 0, SIZE / SOURCE_SIZE, SIZE / SOURCE_SIZE)
  end
}
kinds.yellow_cat = {
  category = 'cats',
  draw_at = function (x, y)
    x = x - SIZE / 2
    y = y - SIZE / 2
    love.graphics.draw(spritesheet, yellow_cat, x, y, 0, SIZE / SOURCE_SIZE, SIZE / SOURCE_SIZE)
  end
}
kinds.black_cat = {
  category = 'cats',
  draw_at = function (x, y)
    x = x - SIZE / 2
    y = y - SIZE / 2
    love.graphics.draw(spritesheet, black_cat, x, y, 0, SIZE / SOURCE_SIZE, SIZE / SOURCE_SIZE)
  end
}
kinds.cat_food = {
  category = 'cats',
  draw_at = function (x, y)
    x = x - SIZE / 2
    y = y - SIZE / 2
    love.graphics.draw(spritesheet, cat_food, x, y, 0, SIZE / SOURCE_SIZE, SIZE / SOURCE_SIZE)
  end
}
kinds.laundry_basket = {
  category = 'laundry',
  draw_at = function (x, y)
    x = x - SIZE / 2
    y = y - SIZE / 2
    love.graphics.draw(spritesheet, laundry_basket, x, y, 0, SIZE / SOURCE_SIZE, SIZE / SOURCE_SIZE)
  end
}
kinds.laundry_pile = {
  category = 'laundry',
  draw_at = function (x, y)
    x = x - SIZE / 2
    y = y - SIZE / 2
    love.graphics.draw(spritesheet, laundry_pile, x, y, 0, SIZE / SOURCE_SIZE, SIZE / SOURCE_SIZE)
  end
}
kinds.jeans = {
  category = 'laundry',
  draw_at = function (x, y)
    x = x - SIZE / 2
    y = y - SIZE / 2
    love.graphics.draw(spritesheet, jeans, x, y, 0, SIZE / SOURCE_SIZE, SIZE / SOURCE_SIZE)
  end
}
kinds.mug = {
  category = 'dishes',
  draw_at = function (x, y)
    x = x - SIZE / 2
    y = y - SIZE / 2
    love.graphics.draw(spritesheet, mug, x, y, 0, SIZE / SOURCE_SIZE, SIZE / SOURCE_SIZE)
  end
}
kinds.bowl = {
  category = 'dishes',
  draw_at = function (x, y)
    x = x - SIZE / 2
    y = y - SIZE / 2
    love.graphics.draw(spritesheet, bowl, x, y, 0, SIZE / SOURCE_SIZE, SIZE / SOURCE_SIZE)
  end
}
kinds.goblets = {
  category = 'dishes',
  draw_at = function (x, y)
    x = x - SIZE / 2
    y = y - SIZE / 2
    love.graphics.draw(spritesheet, goblets, x, y, 0, SIZE / SOURCE_SIZE, SIZE / SOURCE_SIZE)
  end
}
kinds.flower_vase = {
  category = 'flowers',
  draw_at = function (x, y)
    x = x - SIZE / 2
    y = y - SIZE / 2
    love.graphics.draw(spritesheet, flower_vase, x, y, 0, SIZE / SOURCE_SIZE, SIZE / SOURCE_SIZE)
  end
}
kinds.purple_flowers = {
  category = 'flowers',
  draw_at = function (x, y)
    x = x - SIZE / 2
    y = y - SIZE / 2
    love.graphics.draw(spritesheet, purple_flowers, x, y, 0, SIZE / SOURCE_SIZE, SIZE / SOURCE_SIZE)
  end
}
kinds.pink_flowers = {
  category = 'flowers',
  draw_at = function (x, y)
    x = x - SIZE / 2
    y = y - SIZE / 2
    love.graphics.draw(spritesheet, pink_flowers, x, y, 0, SIZE / SOURCE_SIZE, SIZE / SOURCE_SIZE)
  end
}
kinds.apple = {
  category = 'fruits',
  draw_at = function (x, y)
    x = x - SIZE / 2
    y = y - SIZE / 2
    love.graphics.draw(spritesheet, apple, x, y, 0, SIZE / SOURCE_SIZE, SIZE / SOURCE_SIZE)
  end
}
kinds.orange = {
  category = 'fruits',
  draw_at = function (x, y)
    x = x - SIZE / 2
    y = y - SIZE / 2
    love.graphics.draw(spritesheet, orange, x, y, 0, SIZE / SOURCE_SIZE, SIZE / SOURCE_SIZE)
  end
}
kinds.pineapple = {
  category = 'fruits',
  draw_at = function (x, y)
    x = x - SIZE / 2
    y = y - SIZE / 2
    love.graphics.draw(spritesheet, pineapple, x, y, 0, SIZE / SOURCE_SIZE, SIZE / SOURCE_SIZE)
  end
}

function random_kind()
  local seen = 0
  local selected_kind = nil
  for k, v in pairs(kinds) do
    seen = seen + 1
    if love.math.random(seen) == 1 then
      selected_kind = k
    end
  end
  assert(selected_kind)
  return selected_kind
end

function tween_juicy_text()
  tween( 1.5, juicy_text, {width = 200, height = 100}, "outElastic")
end

function juicy_text_image(category)
  local image = nil
  if category ~= nil then
    if category == 'laundry' then 
       image = jt_laundry
    elseif category == 'cats' then
       image = jt_cats
    elseif category == 'dishes' then
       image = jt_dishes
    elseif category == 'flowers' then
       image = jt_flowers
    elseif category == 'fruits' then
       image = jt_fruits
    elseif category == 'books' then
       image = jt_books
    end
    love.graphics.setColor(255,255,255)
    love.graphics.draw(jt_spritesheet, image, CENTER_X-(juicy_text.width/2), TEXT_Y-(juicy_text.height/2), 0, juicy_text.width / 200, juicy_text.height / 100)
  else
    --stuff
  end
  --love.graphics.setColor(255,0,0)
  --love.graphics.rectangle("fill", CENTER_X-(juicy_text.width/2), TEXT_Y-juicy_text.height, juicy_text.width, juicy_text.height)
end

function draw_juicy_text(category)
  if jt_frame == 100 then
    juicy_text.x, juicy_text.y = CENTER_X, TEXT_Y
    juicy_text.width, juicy_text.height = 8, 4
    tween_juicy_text()
    jt_frame = jt_frame - 1
  else
    juicy_text_image(jt_category)
    jt_frame = jt_frame - 1
  end
  if jt_frame == 0 then
    jt_category = nil
    --stop drawing juicy text
  end
end

function tween_instructions()
  tween( 3, instructions, {width = 800, height = 800}, "outElastic")
end

function instructions_image()
  love.graphics.setColor(255,255,255)
  love.graphics.draw(instructions_overlay, CENTER_X-(instructions.width/2), CENTER_Y-(instructions.height/2), 0, instructions.width / 800, instructions.height / 800)
end

function draw_instructions()
  if instructions_frames > 160 then
    instructions_frames = instructions_frames - 1
  elseif instructions_frames == 160 then
    instructions.x, instructions.y = CENTER_X, CENTER_Y
    instructions.width, instructions.height = 8, 4
    tween_instructions()
    instructions_image()
    instructions_frames = instructions_frames - 1
  else
    instructions_image()
    instructions_frames = instructions_frames - 1
  end
  if instructions_frames == 0 then
    --stop drawing instructions
  end
end

function x_to_col(x)
  return math.floor((x - NUDGE_X) / SIZE + 0.5)
end

function col_to_x(x)
  return x * SIZE + NUDGE_X
end

function y_to_row(y)
  return math.floor((y - NUDGE_Y) / SIZE + 0.5)
end

function row_to_y(y)
  return y * SIZE + NUDGE_Y
end

function new_random_item(initial_x, initial_y)
  local new_item = {
    kind = random_kind(),
    x = initial_x,
    y = initial_y,
    next_x = initial_x, -- this represents velocity / momentum
    next_y = initial_y,
    location = 'grid'
  }
  grid[y_to_row(initial_y)][x_to_col(initial_x)] = new_item
  categories[kinds[new_item.kind].category].count = categories[kinds[new_item.kind].category].count + 1
  return new_item
end

function draw_item(item)
  kinds[item.kind].draw_at(item.x, item.y)
end

function obstacle(row_number, col_number)
  if row_number < -100 then
    return false
  elseif col_number < 1 then
    return true
  elseif col_number > COLS then
    return true
  elseif row_number > ROWS then
    return true
  else
    return grid[row_number][col_number]
  end
end

function category_at(row, col)
  if grid[row] == nil then
    return nil
  elseif grid[row][col] == nil then
    return nil
  elseif grid[row][col].location == 'locked' then
    return nil
  else
   return kinds[grid[row][col].kind].category
  end
end

function erase(list, value)
  local found = false
  for i = #list, 1, -1 do
    if list[i] == value then
      assert(not found)
      table.remove(list, i)
      found = true
    end
  end
  score[value] = true
  categories[kinds[value.kind].category].count = categories[kinds[value.kind].category].count - 1
end

function update_matches()
  local to_vanish = {}
  local category_match = nil
  for row_number = 1, ROWS do
    for col_number = 1, COLS do
      local should_vanish = false
      -- horizontal triples
      if not should_vanish then
        local c1 = category_at(row_number, col_number - 2)
        local c2 = category_at(row_number, col_number - 1)
        local c3 = category_at(row_number, col_number - 0)
        if c1 and c2 and c3 and c1 == c2 and c2 == c3 then
          should_vanish = true
          category_match = c1
        end
      end
      if not should_vanish then
        local c1 = category_at(row_number, col_number - 1)
        local c2 = category_at(row_number, col_number - 0)
        local c3 = category_at(row_number, col_number + 1)
        if c1 and c2 and c3 and c1 == c2 and c2 == c3 then
          should_vanish = true
          category_match = c1
        end
      end
      if not should_vanish then
        local c1 = category_at(row_number, col_number - 0)
        local c2 = category_at(row_number, col_number + 1)
        local c3 = category_at(row_number, col_number + 2)
        if c1 and c2 and c3 and c1 == c2 and c2 == c3 then
          should_vanish = true
          category_match = c1
        end
      end
      -- vertical triples
      if not should_vanish then
        local c1 = category_at(row_number - 2, col_number)
        local c2 = category_at(row_number - 1, col_number)
        local c3 = category_at(row_number, col_number)
        if c1 and c2 and c3 and c1 == c2 and c2 == c3 then
          should_vanish = true
          category_match = c1
        end
      end
      if not should_vanish then
        local c1 = category_at(row_number - 1, col_number)
        local c2 = category_at(row_number, col_number)
        local c3 = category_at(row_number + 1, col_number)
        if c1 and c2 and c3 and c1 == c2 and c2 == c3 then
          should_vanish = true
          category_match = c1
        end
      end
      if not should_vanish then
        local c1 = category_at(row_number, col_number)
        local c2 = category_at(row_number + 1, col_number)
        local c3 = category_at(row_number + 2, col_number)
        if c1 and c2 and c3 and c1 == c2 and c2 == c3 then
          should_vanish = true
          category_match = c1
        end
      end

      if should_vanish then
        table.insert(to_vanish, {row_number, col_number})
      end
    end
  end
  if #to_vanish > 0 then
    if determination > 0 then
      for i, v in ipairs(to_vanish) do
        local row_number, col_number = v[1], v[2]
        local item = grid[row_number][col_number]
        grid[row_number][col_number] = nil
        erase(items, item)
      end
      score_sound:play()
      --call tween/draw juicy text with 
    else
      -- lock in place
      for i, v in ipairs(to_vanish) do
        local row_number, col_number = v[1], v[2]
        local item = grid[row_number][col_number]
        item.location = 'locked'
        categories[kinds[item.kind].category].count = categories[kinds[item.kind].category].count - 1
      end
      determination = MAX_DETERMINATION
      love_sound:play()
    end
    jt_category = category_match
    jt_frame = 100
  end
end

function update_item(item)
  if item.location == 'falling' then
    local row = y_to_row(item.y)
    local col = x_to_col(item.x)
    if item.next_y > item.y and obstacle(row+1, col) then
      if grid[row][col] then
        -- emergency, can't go down and can't land
        print('emergency at '..row..', '..col)
        return
      end
      -- land here
      bump_sound:play()
      -- snap to grid
      item.x = col_to_x(col)
      item.y = row_to_y(row)
      -- stop momentum
      item.next_x = item.x
      item.next_y = item.y
      assert(grid[row][col] == nil)
      grid[row][col] = item
      item.location = 'grid'
    else
      -- move according to gravity
      local new_x = item.next_x
      local new_y = item.next_y
      local new_next_x = item.next_x + (item.next_x - item.x)
      local new_next_y = item.next_y + (item.next_y - item.y) + GRAVITY
      item.x = new_x
      item.y = new_y
      item.next_x = new_next_x
      item.next_y = new_next_y
    end
  end
  
  if item.location == 'grid' then
    local row = y_to_row(item.y)
    local col = x_to_col(item.x)
    if not obstacle(row+1, col) then
      -- start falling
      grid[row][col] = nil
      item.location = 'falling'
    end
  end

  if item.location == 'hand' then
    assert(item == hand)
    hand.x, hand.y = love.mouse.getPosition()
    hand.next_x, hand.next_y = hand.x, hand.y
  end
end

function love.load()
  instructions_overlay = love.graphics.newImage('instructions.png')

  spritesheet = love.graphics.newImage('final_sprites_64.png')
  jeans = love.graphics.newQuad(0 * SOURCE_SIZE, 0 * SOURCE_SIZE, SOURCE_SIZE, SOURCE_SIZE, 3 * SOURCE_SIZE, 6 * SOURCE_SIZE)
  cat_food = love.graphics.newQuad(1 * SOURCE_SIZE, 0 * SOURCE_SIZE, SOURCE_SIZE, SOURCE_SIZE, 3 * SOURCE_SIZE, 6 * SOURCE_SIZE)
  laundry_pile = love.graphics.newQuad(2 * SOURCE_SIZE, 0 * SOURCE_SIZE, SOURCE_SIZE, SOURCE_SIZE, 3 * SOURCE_SIZE, 6 * SOURCE_SIZE)
  laundry_basket = love.graphics.newQuad(0 * SOURCE_SIZE, 1 * SOURCE_SIZE, SOURCE_SIZE, SOURCE_SIZE, 3 * SOURCE_SIZE, 6 * SOURCE_SIZE)
  yellow_cat = love.graphics.newQuad(1 * SOURCE_SIZE, 1 * SOURCE_SIZE, SOURCE_SIZE, SOURCE_SIZE, 3 * SOURCE_SIZE, 6 * SOURCE_SIZE)
  black_cat = love.graphics.newQuad(2 * SOURCE_SIZE, 1 * SOURCE_SIZE, SOURCE_SIZE, SOURCE_SIZE, 3 * SOURCE_SIZE, 6 * SOURCE_SIZE)
  blue_book = love.graphics.newQuad(0 * SOURCE_SIZE, 2 * SOURCE_SIZE, SOURCE_SIZE, SOURCE_SIZE, 3 * SOURCE_SIZE, 6 * SOURCE_SIZE)
  green_book = love.graphics.newQuad(1 * SOURCE_SIZE, 2 * SOURCE_SIZE, SOURCE_SIZE, SOURCE_SIZE, 3 * SOURCE_SIZE, 6 * SOURCE_SIZE)
  brown_book = love.graphics.newQuad(2 * SOURCE_SIZE, 2 * SOURCE_SIZE, SOURCE_SIZE, SOURCE_SIZE, 3 * SOURCE_SIZE, 6 * SOURCE_SIZE)
  mug = love.graphics.newQuad(0 * SOURCE_SIZE, 3 * SOURCE_SIZE, SOURCE_SIZE, SOURCE_SIZE, 3 * SOURCE_SIZE, 6 * SOURCE_SIZE)
  bowl = love.graphics.newQuad(1 * SOURCE_SIZE, 3 * SOURCE_SIZE, SOURCE_SIZE, SOURCE_SIZE, 3 * SOURCE_SIZE, 6 * SOURCE_SIZE)
  goblets = love.graphics.newQuad(2 * SOURCE_SIZE, 3 * SOURCE_SIZE, SOURCE_SIZE, SOURCE_SIZE, 3 * SOURCE_SIZE, 6 * SOURCE_SIZE)
  flower_vase = love.graphics.newQuad(0 * SOURCE_SIZE, 4 * SOURCE_SIZE, SOURCE_SIZE, SOURCE_SIZE, 3 * SOURCE_SIZE, 6 * SOURCE_SIZE)
  purple_flowers = love.graphics.newQuad(1 * SOURCE_SIZE, 4 * SOURCE_SIZE, SOURCE_SIZE, SOURCE_SIZE, 3 * SOURCE_SIZE, 6 * SOURCE_SIZE)
  pink_flowers = love.graphics.newQuad(2 * SOURCE_SIZE, 4 * SOURCE_SIZE, SOURCE_SIZE, SOURCE_SIZE, 3 * SOURCE_SIZE, 6 * SOURCE_SIZE)
  apple = love.graphics.newQuad(0 * SOURCE_SIZE, 5 * SOURCE_SIZE, SOURCE_SIZE, SOURCE_SIZE, 3 * SOURCE_SIZE, 6 * SOURCE_SIZE)
  orange = love.graphics.newQuad(1 * SOURCE_SIZE, 5 * SOURCE_SIZE, SOURCE_SIZE, SOURCE_SIZE, 3 * SOURCE_SIZE, 6 * SOURCE_SIZE)
  pineapple = love.graphics.newQuad(2 * SOURCE_SIZE, 5 * SOURCE_SIZE, SOURCE_SIZE, SOURCE_SIZE, 3 * SOURCE_SIZE, 6 * SOURCE_SIZE)
  
  jt_spritesheet = love.graphics.newImage('congratulations_spritesheet.png')
  jt_laundry = love.graphics.newQuad(0, 0, 200, 100, 200, 600)
  jt_cats = love.graphics.newQuad(0, 100, 200, 100, 200, 600)
  jt_dishes = love.graphics.newQuad(0, 200, 200, 100, 200, 600)
  jt_flowers = love.graphics.newQuad(0, 300, 200, 100, 200, 600)
  jt_fruits = love.graphics.newQuad(0, 400, 200, 100, 200, 600)
  jt_books = love.graphics.newQuad(0, 500, 200, 100, 200, 600)
  
  background = love.graphics.newImage('background.png')
  starting_splash = love.graphics.newImage('house.png') -- TODO: replace this with newImage(realsplash)
  ending_splash = love.graphics.newImage('house.png') -- TODO: replace this with newImage(realend)
  
  font = love.graphics.newFont("saru.ttf", 30)
  love.graphics.setFont(font)
  
  bump_sound = love.audio.newSource("bump.mp3", "static")
  score_sound = love.audio.newSource("score.wav", "static")
  love_sound = love.audio.newSource("love.wav", "static")
  bgm = love.audio.newSource("audio.mp3", "stream")
  bgm:setLooping(true)
  love.audio.play(bgm)  
  
  mode = 'starting_splash'
end

function count_score()
  local accum = 0
  for k, v in pairs(score) do
    accum = accum + 1
  end
  return accum
end

function check_item_in_score(item)
  assert(score[item])
end

function check_item_in_grid(item)
  assert(grid[y_to_row(item.y)][x_to_col(item.x)] == item)
end

function check_item_in_bounds(item)
  local row = y_to_row(item.y)
  local col = x_to_col(item.x)
  assert(row <= ROWS)
  if col < 1 then
    print('found item at column '..col)
  end
  assert(1 <= col)
  assert(col <= COLS)
end

function check_item_in_hand(item)
  assert(item == hand)
end

function check_invariant()
  -- every item is either in score, or in the grid (possibly locked) or falling, or in hand
  for i, item in pairs(items) do
    if item.location == 'score' then
      check_item_in_score(item)
    elseif item.location == 'grid' or item.location == 'locked' then
      check_item_in_grid(item)
    elseif item.location == 'falling' then
      check_item_in_bounds(item)
    elseif item.location == 'hand' then
      check_item_in_hand(item)
    else
      assert(false)
    end
  end
end


function playing_draw()
  -- TODO: draw score and determination rectangles
  -- background color
  love.graphics.setColor(255, 255, 255, 255)
  love.graphics.rectangle('fill', 0, 0, love.graphics.getWidth(), love.graphics.getHeight())
  -- score bar
  love.graphics.setColor(60, 45, 210)
  love.graphics.rectangle('fill', 60, 715, 25, -1 * PIXELS_PER_SCORE * count_score()) 
  -- determination bar
  love.graphics.setColor(249, 56, 58)
  love.graphics.rectangle('fill', 720, 715, 25, -1 * PIXELS_PER_DETERMINATION * determination)
  love.graphics.setColor(255, 255, 255, 255)
  -- background image layer
  love.graphics.draw(background)
  -- items layer
  --[[ DEBUG VISUALIZATION
  love.graphics.setColor(100, 100, 100, 100)
  for row_number = -100, ROWS do
    for col_number = 1, COLS do
      if grid[row_number][col_number] then
        love.graphics.rectangle('fill', col_to_x(col_number) - SIZE / 2, row_to_y(row_number) - SIZE / 2, SIZE, SIZE)
      end
    end
  end
  -- END DEBUG VISUALIZATION ]]
  for i, item in pairs(items) do
    if item ~= hand then
      draw_item(item)
    end
  end
  -- draw pink love-locked rectangles
  love.graphics.setColor(249, 56, 58, 50)
  for i, item in pairs(items) do
    if item ~= hand and item.location == 'locked' then
      love.graphics.rectangle('fill', item.x - SIZE / 2, item.y - SIZE / 2, SIZE, SIZE)
    end
  end
  -- item in hand layer
  love.graphics.setColor(255, 255, 255, 150)
  if hand then
    draw_item(hand)
  end
  -- highlight layer
  local mx, my = love.mouse.getPosition()
  local mrow, mcol = y_to_row(my), x_to_col(mx)
  if mrow < 1 or mrow > ROWS or mcol < 1 or mcol > COLS then
    -- do nothing
  else
    -- draw 'if you click object in hand will go here' highlight
    love.graphics.setColor(0, 0, 255, 100)
    love.graphics.rectangle('line', col_to_x(mcol) - SIZE / 2, row_to_y(mrow) - SIZE / 2, SIZE, SIZE)
  end
  -- TODO: draw juicey congratulatory text layer
  if jt_frame > 0 then
    draw_juicy_text()
  end
end

function playing_update()
  check_invariant()
  for i, item in pairs(items) do
    update_item(item)
  end
  check_invariant()
  update_matches()
  check_invariant()
  local should_quit = true
  for k, v in pairs(categories) do
    if v.count > 2 then
      -- don't quit, there's still progress possible!
      should_quit = false
    end
  end
  if should_quit then
    frames = 0
    mode = 'fadeout'
  end
end

function playing_mousepressed(mx, my, button)
  check_invariant()
  local mrow, mcol = y_to_row(my), x_to_col(mx)
  if mrow < 1 or mrow > ROWS or mcol < 1 or mcol > COLS then
    print('clicked out of bounds')
    return
  end

  if hand then
    -- trying to put something down
    if grid[mrow] and grid[mrow][mcol] then
      -- trying to swap with something in the grid
      if grid[mrow][mcol].location ~= 'locked' then
        -- swapping with something in the grid
        bump_sound:play()
        local temp = grid[mrow][mcol]
        hand.location = 'grid'
        hand.x = col_to_x(mcol)
        hand.y = row_to_y(mrow)
        hand.next_x = hand.x
        hand.next_y = hand.y
        grid[mrow][mcol] = hand
        hand = temp
        hand.location = 'hand'
        if determination > 0 then
          determination = determination - 1
        end
      end
    else
      -- putting something down in empty space
      hand.location = 'falling'
      -- snap to a column
      hand.x = col_to_x(x_to_col(hand.x))
      hand.next_x = hand.x
      check_item_in_bounds(hand)
      hand = nil
      if determination > 0 then
        determination = determination - 1
      end
    end
  else
    -- possibly picking something up
    if grid[mrow] and grid[mrow][mcol] and grid[mrow][mcol].location ~= 'locked' then
      hand = grid[mrow][mcol]
      hand.location = 'hand'
      grid[mrow][mcol] = nil
      if determination > 0 then
        determination = determination - 1
      end
    end
  end
  check_invariant()
end

function love.draw()
  if mode == 'starting_splash' then
    -- TODO: Katie pulls this out into a function to draw
    love.graphics.setColor(255, 255, 255, 255)
    love.graphics.draw(starting_splash)
    draw_instructions()
  elseif mode == 'playing' then
    playing_draw()
  elseif mode == 'fadeout' then
    playing_draw()
  elseif mode == 'ending_splash' then
    -- TODO: Katie pulls this out into a function to draw
    love.graphics.setColor(255, 255, 255, 255)
    love.graphics.draw(ending_splash)
    love.graphics.setColor(60, 45, 210)
    love.graphics.printf("Your score is: " .. count_score() * 100, 0, 320, 800, "center")
  else
    assert(false)
  end
end

function love.update(dt)
  tween.update(dt)
  if mode == 'starting_splash' then
    -- do nothing
  elseif mode == 'playing' then
    playing_update()
  elseif mode == 'fadeout' then
    frames = frames + 1
    if frames > 60 then
      mode = 'ending_splash'
    end
  elseif mode == 'ending_splash' then
    -- do nothing  
  else
    assert(false)
  end
end

function love.mousepressed(mx, my)
  if mode == 'starting_splash' and instructions_frames < 0 then
    -- setup
    categories.books = { count = 0}
    categories.cats = { count = 0 }
    categories.laundry = { count = 0 }
    categories.dishes = { count = 0 }
    categories.flowers = { count = 0 }
    categories.fruits = { count = 0 }
    score = {}
    determination = 6
    grid = {}
    for row_number = -100, ROWS do
      grid[row_number] = {}
    end
    items = {}
    for row_number = 1, ROWS do
      for col_number = 1, COLS do
        table.insert(items, new_random_item(col_to_x(col_number), row_to_y(row_number)))
      end
    end
    hand = nil
    mode = 'playing'
  elseif mode == 'playing' then
    playing_mousepressed(mx, my)
  elseif mode == 'fadeout' then
    -- do nothing
  elseif mode == 'ending_splash' then
    mode = 'starting_splash'
    instructions_frames = 200
  else
    -- do nothing
  end
end

