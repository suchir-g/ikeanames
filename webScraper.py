import requests
from bs4 import BeautifulSoup

url = 'https://www.ikea.com/gb/en/cat/series-series/'

response = requests.get(url)

soup = BeautifulSoup(response.content, 'html.parser', from_encoding='utf-8')

products = soup.find_all('a', class_='vn__textnav__link')

product_dict = {}

for product in products:
    link = product['href']
    name = product.text.strip() 
    
    if not name or '�' in name:
        name_part = link.rsplit('/', 2)[-2] 
        name = name_part.replace('-', ' ') 
        if name.lower().endswith(' series'): 
            name = name[:-7] 
        name = name.title() 
    
    product_dict[name] = link

output_text_file = 'ikea_products.txt'

with open(output_text_file, 'w', encoding='utf-8') as file:
    for name, link in product_dict.items():
        file.write(f"{name}, {link}\n")
