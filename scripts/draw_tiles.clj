(use 'clojure.contrib.duck-streams)
(import '(javax.imageio ImageIO))

(def cntr (atom 0))

(defn to-int-arr [strs]
  (into-array
    Integer/TYPE
    (map #(Integer/valueOf %) strs)))
    
(defn read-polys []
  (map
  	#(.split % " ")
  	(remove #(.isEmpty %) (read-lines (first *command-line-args*)))))

(defn polys-grouped-by-tile []
  (reduce
    (fn [res [tile & rst :as line]]
      (update-in res [tile] conj line))
    {}
    (read-polys)))
  
(doseq [[tile polys] (polys-grouped-by-tile)]
  (swap! cntr inc)
  (println @cntr "Drawing" (count polys) "for " tile)
  (let [img-file (java.io.File. tile)
  		img (ImageIO/read img-file)
  		g2d (.getGraphics img)]
    (doseq [[_ r g b a poly] polys]
      (let [coords (.split poly ",")
  		    xpoints (to-int-arr (take-nth 2 coords))
  		    ypoints (to-int-arr (take-nth 2 (rest coords)))]
  	    (.setPaint g2d (java.awt.Color. (Integer/valueOf r) (Integer/valueOf g) (Integer/valueOf b) (Integer/valueOf a)))
  	    (.fillPolygon g2d xpoints ypoints (/ (count coords) 2))))
  	(.dispose g2d)
  	(ImageIO/write img "png" img-file)))
  	
  	
	