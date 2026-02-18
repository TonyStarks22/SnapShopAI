from elasticsearch import Elasticsearch

es = Elasticsearch("http://localhost:9200")

def search_keywords(query: str, filters: dict = None, size=100):
    body = {
        "query": {
            "bool": {
                "must": {"multi_match": {"query": query, "fields": ["title", "description"]}},
                "filter": filters or {}
            }
        },
        "size": size
    }
    response = es.search(index="products", body=body)
    return response["hits"]["hits"]