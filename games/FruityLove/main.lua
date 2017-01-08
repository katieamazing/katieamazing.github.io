require "gradient"
local socket = require("socket")
local http = require("socket.http")
local tween = require "tween"

h = 8
w = 16
nx = 32
ny = 32
sfx_pickup = love.audio.newSource("pickup.wav", "static")
sfx_eep = love.audio.newSource("eep.wav", "static")
local player = { x = nx, y = ny }
local trapdoor = { x = nx, y = ny, width = 8, height = 4 }
mouth, frame, char_ct = 0, 0, 0
score, score_display = 0, 0
text = ""
scores = {}
level_xfer = false
splash_screen = true

math.randomseed(os.time())

function load_score()
  toload = love.filesystem.load("save.txt")
  toload()
end

function love.load()
  love.window.setMode((2*8)*32, (2*6)*32)
  bigfont = love.graphics.newFont("slkscr.ttf", 30)
  font = love.graphics.newFont("slkscr.ttf", 14)
  love.graphics.setFont(font)
  load_score()
  color_shift = love.graphics.newShader [[
    extern number time;
    vec4 effect(vec4 color, Image texture, vec2 texture_coords, vec2 pixel_coords)
     {return vec4((2.0+sin(time))/2.0, abs(cos(time))+0.2, 0.5, 1.0);
      }
  ]]
end

function make_grid(w, h)
  grid = {}
  for row = 1, h, 1 do
	r = {}
	for col = 1, w, 1 do
		table.insert(r, true)
	end
	table.insert(grid, r)
  end
  return grid
end
  
function shuffle(t)
    for i = 1, #t - 1 do
        local r = math.random(i, #t)
        t[i], t[r] = t[r], t[i]
    end
end

function average(a, b)
  return (a + b)/2
end

function walk(x, y)
  map[y][x] = false
  d = {{x = x - 2, y = y}, {x = x, y = y + 2}, {x = x +2, y = y}, {x = x, y = y - 2}}
  shuffle(d)
  for i, dir in ipairs(d) do
    xx = dir.x
	yy = dir.y
	if map[yy] and map[yy][xx] then
	  map[average(y, yy)][average(x, xx)] = false
      walk(xx, yy)
	end
  end
end

map = make_grid(2*w+1, 2*h+1)
walk(math.random(1, w)*2, math.random(1, h)*2)

function add_falses()
  for i = 1, 10, 1 do
    while true do
      local col, row = math.random(2,2*h), math.random(2,2*w)
      if map[col][row] then
        map[col][row] = false
        break
      end
    end  
  end
end

add_falses()

function drawinrect(img, x, y, w, h, r, ox, oy, kx, ky)
    return -- tail call for a little extra bit of efficiency
    love.graphics.draw(img, x, y, r, w / img:getWidth(), h / img:getHeight(), ox, oy, kx, ky)
end

function draw_batty(x, y)
  x = x + 16
  y = y + 16
  love.graphics.setColor(98,90,120)
  love.graphics.circle("fill", x, y, 12, 10)
  love.graphics.polygon("fill", x-10, y-16, x-10, y-8, x-4, y-8)
  love.graphics.polygon("fill", x+10, y-16, x+10, y-8, x+4, y-8)
  love.graphics.setColor(35,28,57)
  love.graphics.circle("fill", x-4, y-3, 3, 6)
  love.graphics.circle("fill", x+4, y-3, 3, 6)
  love.graphics.polygon("fill", x+2, y, x-2, y, x, y+3)
  love.graphics.polygon("fill", x-4, y+7, x-7, y+14, x-1, y+14)
  love.graphics.polygon("fill", x+4, y+7, x+7, y+14, x+1, y+14)
  if mouth <= 0 then
    love.graphics.line(x-2, y+5, x, y+4, x+2, y+5)
  else
    love.graphics.polygon("fill", x-3, y+3, x, y+6, x+3, y+3)
    mouth = mouth - 1
  end
  love.graphics.setColor(255,255,255)
  if moving == "right" then
    love.graphics.points(x-3, y-3, x+5, y-3)
  elseif moving == "left" then
    love.graphics.points(x-6, y-3, x+2, y-3)
  elseif moving == "up" then
    love.graphics.points(x-4, y-4, x+4, y-4)
  else 
    love.graphics.points(x-4, y-1, x+4, y-1)
  end
end  

prize_class = {}
function new_prize(variety)
	local location = {}
  while true do
      local col, row = math.random(2,2*h), math.random(2,2*w)
      if map[col][row] == false then
        location.x = (row-1)*32
        location.y = (col-1)*32
        break
      end
    end
  location.variety = variety
  location.there = true
	setmetatable(location, { __index = prize_class })
	return location
end

function prize_class:draw()
  if self.there == true then
    if self.variety == "blackberry"
    or self.variety == "raspberry" 
    or self.variety == "salmonberry" then
      if self.pips == nil then
        self:init_berry()
      end
      self:draw_berry()
    elseif self.variety == "apple" then
      self:draw_apple()
    elseif self.variety == "blueberry" then
      self:init_blueberry()
      self:draw_blueberry()
    end
  end
end

function prize_class:init_berry()
  self.pips = {}
  local r, g, b
  if self.variety == "blackberry" then
    r, g, b = 120, 20, 200
  elseif self.variety == "raspberry" then
    r, g, b = 220, 10, 100
  elseif self.variety == "salmonberry" then
    r, g, b = 255, 180, 112
  end
    for i = 1, 16, 1 do
      self.pips[#self.pips + 1] = {
        p_x = math.random(self.x+8, self.x+25),
        p_y = math.random(self.y+8, self.y+25),
        p_r = math.random(r-20, r+20),
        p_g = math.random(g-20, g+20),
        p_b = math.random(b-20, b+20),
        p_rad = math.random(3,5)
      }
    end
end

function prize_class:draw_berry()
  for i, pip in ipairs(self.pips) do
    love.graphics.setColor(pip.p_r, pip.p_g, pip.p_b)
    love.graphics.circle("fill", pip.p_x, pip.p_y, pip.p_rad, 16)
  end
end

function prize_class:draw_apple()
  local x, y = self.x + 16, self.y + 17
  love.graphics.setShader(color_shift)
  love.graphics.ellipse("fill", x+5, y, 8, 12, 12)
  love.graphics.ellipse("fill", x-4, y, 8, 12, 12)
  love.graphics.polygon("fill", x-1, y-8, x-1, y-14, x+1, y-14, x+1, y-8, 
                        x+3, y-12, x+5, y-15, x+7, y-16, x+5, y-12, x+4, y-10)
  love.graphics.setShader()
  love.graphics.setColor(255,255,255)
  love.graphics.circle("fill", x+7, y-10, 2, 6)
  love.graphics.circle("fill", x+8, y-8, 1, 6)
end

function prize_class:init_blueberry()
  local x, y = self.x + 16, self.y + 20
  bb_vertices = {x+6, y-9, x+7, y-17, x+3, y-13, x, y-19, x-3, y-13, x-7, y-17, x-6, y-9}
  love.graphics.polygon("fill", bb_vertices)
  love.graphics.circle("fill", x, y, 12, 10)
end

function prize_class:draw_blueberry()
  local bx, by = self.x + 16, self.y + 20
  local rainbow = gradient {
    direction = 'horizontal';
    {255,255,255};
    {5, 0, 132};
  }
  love.graphics.stencil(function()self:init_blueberry()end, "replace", 1)
  love.graphics.setStencilTest("greater", 0)
  love.graphics.setColor(5, 0, 255)
  drawinrect(rainbow, bx-25, by-25, 50, 50)
  love.graphics.setStencilTest()
  love.graphics.setColor(255,255,255)
  love.graphics.circle("fill", bx+6, by-6, 2, 6)
  love.graphics.circle("fill", bx+7, by-4, 1, 6)
end

kinds = {{"blackberry", 3}, {"raspberry", 3}, {"salmonberry", 3}, {"apple", 1}, {"blueberry", 2}}

function build_prize_list()
  prizes = {}
  for i = 1,12 do
    table.insert(prizes, new_prize(random_kind()))
  end
end

function random_kind()
  local totalweight = 0
  for i = 1, #kinds do
    totalweight = totalweight + kinds[i][2]
  end
  local weightvalue = math.random(0, totalweight)
  for i = 1, #kinds do
    if weightvalue < kinds[i][2] then return kinds[i][1]
    else weightvalue = weightvalue - kinds[i][2]
    end
  end
  return kinds[1][1]
end
  
build_prize_list()

function prize_class:collision()
  if self.x < nx+15 and nx+15 < self.x + 20 and self.y < ny+15 and self.y + 20 > ny+15
  and self.there == true and splash_screen == false then
    love.audio.rewind(sfx_pickup)
    love.audio.play(sfx_pickup)
    self.there = false
    mouth = 60
    if self.variety == "blackberry"
    or self.variety == "raspberry" 
    or self.variety == "salmonberry" then
      score, score_display = score + 10, score_display + 10
    elseif self.variety == "apple" then
      score, score_display = score + 50, score_display + 50
    elseif self.variety == "blueberry" then
      score, score_display = score + 20, score_display + 20
    end
  end
end

function collision(nx, ny) --wall collision check
  nx = nx + 32
  ny = ny + 32
  return map[math.floor(ny/32)] and map[math.floor(ny/32)][math.floor(nx/32)]
end

function batty_collision(new_nx, new_ny) -- movement for nx, ny collision from update
  if collision(new_nx, new_ny) or collision(new_nx + 30, new_ny + 30)
    or collision(new_nx + 30, new_ny) or collision(new_nx, new_ny + 30) == true then
    return false
  else
    nx = new_nx
    ny = new_ny
    return true
  end
end
--TWEEN STUFF--
function tween_player(state)
  if state == "level_change" then
    tween( .5, player, {x = nx, y = ny + 32}, "inBack")
  else
    tween( .15, player, { x = nx, y = ny }, "linear")
  end
end

function tween_trapdoor()
  tween( 1.5, trapdoor, {width = 32, height = 16}, "linear")
end
--/TWEEN STUFF--
function score_box()
  local xmax, ymax = player.x+(((2*8)*32)/2), player.y+(((2*6)*32)/2)
  love.graphics.rectangle("fill", xmax-120, ymax-42, 100, 20)
  love.graphics.circle("fill", xmax-120, ymax-32, 10, 16)
  love.graphics.circle("fill", xmax-20, ymax-32, 10, 16)
end

function draw_score()
  local xmax, ymax = player.x+(((2*8)*32)/2), player.y+(((2*6)*32)/2)
  love.graphics.setColor(255, 255, 255)
  love.graphics.rectangle("fill", xmax-120, ymax-44, 104, 24)
  love.graphics.circle("fill", xmax-120, ymax-32, 12, 16)
  love.graphics.circle("fill", xmax-20, ymax-32, 12, 16)
  love.graphics.stencil(score_box, "replace", 1)
  love.graphics.setStencilTest("greater", 0)
  love.graphics.setColor(255, 200, 67)
  love.graphics.rectangle("fill", xmax-130, ymax-50, score_display, 30)
  love.graphics.setStencilTest()
  if level_xfer == false then 
    if score_display >= 120 then 
      level_xfer = true
      save_score()
      frame = 150
    end
  end
  love.graphics.setColor(0, 0, 0)
  love.graphics.printf("SCORE: " .. score, xmax-120, ymax-39, 100, "center")
end

function save_score()
  print("saving score of ".. score)
  local save = ""
  save = save.."score = "..score
  love.filesystem.write("save.txt", save)
end

function trapdoor_stencil() 
  love.graphics.rectangle("fill", nx, ny, 32, 30)
end

function the_door()
    love.graphics.setColor(255, 200, 67)
    love.graphics.rectangle("fill", (nx+16)-(trapdoor.width/2), (ny+32)-trapdoor.height, trapdoor.width, trapdoor.height)
    love.graphics.setColor(0,0,0)
    love.graphics.rectangle("fill", ((nx+16)-(trapdoor.width/2))+2, (ny+34)-trapdoor.height, trapdoor.width-4, trapdoor.height-4)
end

function draw_trapdoor(nx, ny)
  if frame == 150 then
    trapdoor.x, trapdoor.y = nx, ny
    trapdoor.width, trapdoor.height = 8, 4
    tween_trapdoor()
    draw_batty(player.x, player.y)
    frame = frame - 1
  elseif frame > 60 and frame < 150 then
    --trapdoor tweening
    the_door()
    draw_batty(player.x, player.y)
    frame = frame - 1
  elseif frame == 60 then
    tween_player("level_change")
    love.audio.play(sfx_eep)
    frame = frame - 1
  elseif frame >= 20 and frame < 60 then
    --batty tweening down into doorway
    the_door()
    love.graphics.stencil(trapdoor_stencil, "replace", 1)
    love.graphics.setStencilTest("greater", 0)
    draw_batty(player.x, player.y)
    love.graphics.setStencilTest()
    frame = frame - 1
  else
    --batty vanished
    the_door()
    frame = frame - 1
  end
  if frame == 0 then reset() end
end
--WEB STUFF--
function get_from_web(address)
  r, e = http.request(address)
  if e == 200 then
    r = string.gsub(r, ": ", " = ")
    r = string.gsub(r, "%[", "{")
    r = string.gsub(r, "%]", "}")
    r = string.gsub(r, '"player"', 'player')
    r = string.gsub(r, '"score"', 'score')
    f, e = loadstring("return " .. r)
    if not f then
      return
    end
    scores = f()
  end 
end

function post_to_web(name, score)
  http.request("http://kt.webscript.io/increment", "player=" .. name .. "&score=" .. tostring(score))
end

--/WEB STUFF--
function draw_splash()
  get_from_web("http://kt.webscript.io/get_scores")
  local xmax, ymax = player.x+(((2*8)*32)/2), player.y+(((2*6)*32)/2)
  local window_w, window_h = (2*8)*32, (2*6)*32
  local px, py = player.x, player.y
  love.graphics.setColor(0,0,0)
  love.graphics.rectangle("fill", 0, 0, xmax, ymax)
  love.graphics.setColor(255,255,255)
  love.graphics.setFont(bigfont)
  love.graphics.printf("Adorable Fruit Bat Game", px-window_w/2, (py-window_h/2)+32, window_w, "center")
  love.graphics.setFont(font)
  love.graphics.printf("High Scores", px-window_w/2, py-64, window_w, "center")
  love.graphics.printf("click anywhere while playing to post your score", px-window_w/2, py+(32*4), window_w, "center")
  love.graphics.printf("Press SPACE to start", px-window_w/2, py+(32*4.75), window_w, "center")
  local hsg = 220
  for i, player_score in ipairs(scores) do
    local player = player_score.player
    local score = player_score.score
    love.graphics.setColor(255, hsg , 80)
    hsg = hsg - 20
    love.graphics.printf(player .. "  " .. score, px - window_w/2, (py + 16*i) - 64,   window_w, "center")
  end  
  local message = "enter your name"
  if score == 0 then
    love.graphics.setColor(0,0,0)
  elseif score > 0 and char_ct < 2 then
    love.graphics.setColor(85, 85, 85)
  elseif score > 0 and char_ct >= 2 then
    love.graphics.setColor(80, 220, 80)
    message = "enter to send"
  end
  love.graphics.printf(text .. "  " .. message, px-window_w/2, py-96, window_w, "center")
end

function love.textinput(t)
  if splash_screen == true and char_ct < 6 and t ~= " " then
    text = text .. t
    char_ct = char_ct + 1
  end
end

function reset()
  player.x, player.y = nx, ny
  mouth = 0
  score_display = 0
  map = make_grid(2*w+1, 2*h+1)
  walk(math.random(1, w)*2, math.random(1, h)*2)
  add_falses()
  if batty_collision(nx, ny) == false then
    nx, ny = 32, 32
    player.x, player.y = 32, 32
  end
  build_prize_list()
  level_xfer = false
end

function love.draw() 
  local tx = math.floor(player.x - love.graphics.getWidth() / 2)
  local ty = math.floor(player.y - love.graphics.getHeight() / 2)
  love.graphics.translate(-tx, -ty)

	love.graphics.setColor(85, 85, 85)
	for row = 1, #map, 1 do
		for col = 1, #map[row], 1 do
			if map[row][col] then
				love.graphics.rectangle("fill", 32*(col-1), 32*(row-1), 32, 32)
			end
		end
	end
  love.graphics.setColor(255,255,255)
  for i, prize in ipairs(prizes) do
    prize.draw(prize)
  end
  if splash_screen == true then
    draw_splash()
  elseif level_xfer == true then 
    draw_trapdoor(nx, ny)
  else
    draw_batty(player.x, player.y)
  end
  draw_score()
end

local t = 0
function love.update(dt)
  tween.update(dt)
  local new_nx = nx
  local new_ny = ny
  local directions = {
  {direction = "up", diralt = "w", delta_x = 0, delta_y = -32, moving = "up"},
  {direction = "down", diralt = "s", delta_x = 0, delta_y = 32, moving = "down"},
  {direction = "left", diralt = "a", delta_x = -32, delta_y = 0, moving = "left"},
  {direction = "right", diralt = "d", delta_x = 32, delta_y = 0, moving = "right"},
  }
  
  if level_xfer == false and splash_screen == false and 
  player.x == nx and player.y == ny then
    for i, d in pairs(directions) do
      if love.keyboard.isDown(d.direction) or love.keyboard.isDown(d.diralt) then
        new_nx = new_nx + d.delta_x
        new_ny = new_ny + d.delta_y
        moving = d.moving
        if batty_collision(new_nx, new_ny) then
          tween_player("normal")
          break
        end
      end
    end
  end
  if love.keyboard.isDown("return") and splash_screen == true and char_ct >= 2 then
    post_to_web(text, score)
    get_from_web("http://kt.webscript.io/get_scores")
  end
  if love.keyboard.isDown("space") and splash_screen == true then
    splash_screen = false
  end
  if love.keyboard.isDown("backspace") or love.keyboard.isDown("delete") and splash_screen == true then
    char_ct = 0
    text = ""
  end
  if love.mouse.isDown(1) and splash_screen == false then
    splash_screen = true
  end
  for i, prize in ipairs(prizes) do
    prize.collision(prize)
  end

  t = t + dt
  color_shift:send("time", t)
end
