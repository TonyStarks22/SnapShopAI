def rrf(rank_lists, k=60):
    scores = {}
    for rank_list in rank_lists:
        for pos, doc_id in enumerate(rank_list):
            scores[doc_id] = scores.get(doc_id, 0) + 1 / (k + pos)
    return sorted(scores.items(), key=lambda x: x[1], reverse=True)