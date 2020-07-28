import urllib.request
import requests
from bs4 import BeautifulSoup
import wget
import shutil
# food_name, ingredients, 


url = 'https://www.jamieoliver.com/recipes/seafood-recipes/mussels-with-guinness/'

headers = {'User-Agent':'Chrome/66.0.3359.181'}
req = urllib.request.Request(url, headers=headers)
html = urllib.request.urlopen(req)
bsobj = BeautifulSoup(html, 'html.parser')


# for name
food_name_selector = bsobj.select('#recipe-single > div > div.row.recipe-header > div.col-xs-12.col-lg-9 > div.row.top-section > div.col-lg-7.col-md-7.col-sm-6.col-sm-ls-5.col-xs-12.single-recipe-details > h1')
food_name_result = food_name_selector[0].text
food_name_result = food_name_result.replace(' ','_')
print(food_name_result)
print('\n')

# for ingredients 
ingre_selector = bsobj.select('#recipe-single > div > div.row.recipe-header > div.col-xs-12.col-lg-9 > div:nth-child(2) > div.recipe-left-col.col-sm-5.col-md-4.col-sd-4.col-lg-4 > div.recipe-ingredients > div.row > div > ul')
ingre_text = ingre_selector[0].text
ingre_res = ' '.join([x for x in ingre_text.split(' ') if len(x)>0])
ingre_temp = ingre_res.split('\n')
for i in range(len(ingre_temp) - 1, 0, -1):
    if (ingre_temp[i]==''):
        ingre_temp.pop(i)
if (ingre_temp[0]==''):
    ingre_temp.pop(0)
for i in range(len(ingre_temp) - 1):
    ingre_temp[i] = ingre_temp[i] + '@'
ingredients_result = ''.join(ingre_temp)
print(ingredients_result)
print('\n')

# for recipe texts
recipe_text_selector = bsobj.select('#recipe-single > div > div.row.recipe-header > div.col-xs-12.col-lg-9 > div:nth-child(2) > div.instructions-col.col-sm-7.col-md-8.col-sd-8.col-lg-8 > div.recipe-instructions > div > div > div:nth-child(2)')
recipe_text_temp = recipe_text_selector[0].text
text_parsed = recipe_text_temp.replace(".",".@")
recipe_text_result = text_parsed.strip()[:-1]
print('\n')
print(recipe_text_result)
print('\n')


# for image crawling
food_img_selector = bsobj.select('#recipe-single > div > div.row.recipe-header > div.col-xs-12.col-lg-9 > div.row.top-section > div.col-lg-5.col-md-5.col-sm-6.col-sm-ls-7.recipe-header-left > div.hero-wrapper > img')
img_url = 'http:' + food_img_selector[0].get("src")
# img_url = food_img_selector[0].get("src")
# local_image_filename = wget.download(req)
# print(local_image_filename)

r = requests.get(img_url, stream = True)
with open('img.png', 'wb') as f:
    r.raw.decode_content = True
    shutil.copyfileobj(r.raw, f)  


# for name
# food_name_selector = bsobj.select('#rContentPlaceHolder1_ctl00_ctl00_0_foodLoveLogo_0 > div > div > h1')
# food_name_result = food_name_selector[0].text
# food_name_result = food_name_result.replace(' ','_')
# print(food_name_result)
# print('\n')

# # for ingredients
# ingredients_selector = bsobj.select('#form > section > ol > li.curated-not-social-content.curated-coloured-bg.has-border.no-numbering > div > div')
# ingredients_list = str(ingredients_selector[0]).split('<p>')[3].split('</p>')[0].split('<br/>')
# for i in range(len(ingredients_list) - 1):
#     ingredients_list[i] = ingredients_list[i] + '@'
# ingredients_result = ''.join(ingredients_list)
# print(ingredients_result)
# print('\n')


# # for recipe_step
# recipe_step_selector = bsobj.select('form > section > ol')
# recipe_step_text = recipe_step_selector[0].text
# recipe_step_temp = recipe_step_text.split('\n')
# for i in range(len(recipe_step_temp) - 1, 0, -1):
#     if (recipe_step_temp[i]==''):
#         recipe_step_temp.pop(i)
# if (recipe_step_temp[0]==''):
#     recipe_step_temp.pop(0)
# recipe_step_temp = recipe_step_temp[0:-3]
# for i in range(len(recipe_step_temp) - 1):
#     recipe_step_temp[i] = recipe_step_temp[i] + '@'
# recipe_step_result = recipe_step_temp[1::2]
# recipe_step_result = ''.join(recipe_step_result)
# print(recipe_step_result)
# print('\n')

# # for step image
# image_selector = bsobj.select('#form > section > ol')
# image_temp = str(image_selector).split('\n')
# # print(image_temp)
# for i in range(len(image_temp) - 1, 0, -1):
#     if '.jpg' not in image_temp[i]:
#         image_temp.pop(i)
# if '.jpg' not in image_temp[0]:
#     image_temp.pop(0)
# image_temp = ''.join(image_temp).split(" src=")
# image_temp.pop(0)
# for i in range(len(image_temp) - 1):
#     image_temp[i] = image_temp[i] + '><'
# image_temp = ''.join(image_temp).split('><')[0::2]
# for i in range(len(image_temp) - 1):
#     image_temp[i] = 'http:/' + image_temp[i] + '@'
# image_temp = ''.join(image_temp)
# image_temp = image_temp.replace('"', "")
# print(image_temp)


# print(len(image_temp))
